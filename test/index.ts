import { createPool } from "@viem/anvil";
import { Address, createPublicClient, http } from "viem";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { mainnet, polygon, arbitrum, optimism } from "viem/chains";
import strategies from "../src/lib/constants/strategies.js";
import { VaultFactory } from "../src/vaultFactory/vaultFactory.js";
import { CachedProvider, Protocol, YieldOptions } from "../src/yieldOptions/index.js";

const MAINNET_URL = "https://eth.llamarpc.com";
const POLYGON_URL = "https://polygon.llamarpc.com";
const ARBITRUM_URL = "https://arbitrum.llamarpc.com";
const OPTIMISM_URL = "https://optimism.llamarpc.com";

const ARCHIVE_PATH = "./archive";
const anvilPool = createPool();
(async () => {
  // We use a local anvil instance to decrease the number of RPC requests sent to a public endpoint.
  const mainnetClient = await createClient(mainnet, MAINNET_URL, 8545);
  const polygonClient = await createClient(polygon, POLYGON_URL, 8546);
  const arbitrumClient = await createClient(arbitrum, ARBITRUM_URL, 8547);
  const optimismClient = await createClient(optimism, OPTIMISM_URL, 8548);

  // Set up classes
  const provider = new CachedProvider();
  await provider.initialize("https://raw.githubusercontent.com/Popcorn-Limited/apy-data/main/apy-data.json");
  const yieldOptions = new YieldOptions({ provider, ttl: 1000 });

  const vaultFactory = new VaultFactory({ address: "0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb", publicClient: mainnetClient, walletClient })

  // Test deployment of each asset for each protocol and store results
  const protocols = yieldOptions.getProtocols(1)
  const result = {}

  protocols.forEach(async protocol => {
    const res = await deployStrategiesForProtocol(yieldOptions, vaultFactory, protocol, 1);
    result[protocol.key] = res;
  })

  console.log("stopping anvil instances");
  await anvilPool.stop(mainnet.id);
  await anvilPool.stop(polygon.id);
  await anvilPool.stop(arbitrum.id);
  await anvilPool.stop(optimism.id);

  console.log("saving result in new json");
  if (!existsSync(ARCHIVE_PATH)) {
    mkdirSync(ARCHIVE_PATH);
  }
  const date = new Date().toISOString().slice(0, 10)

  writeFileSync(`./${date}-deployment-test.json`, JSON.stringify(result), "utf-8");
})();

async function createClient(chain, forkUrl, port) {
  await anvilPool.start(chain.id, {
    port,
    forkUrl,
  });
  const anvilChain = {
    ...chain,
    rpcUrls: {
      default: {
        http: [`http://127.0.0.1:${port}`],
      },
      public: {
        http: [`http://127.0.0.1:${port}`],
      },
    },
  };
  const client = createPublicClient({
    chain: anvilChain,
    transport: http(),
  });

  return client;
}

async function deployStrategiesForProtocol(yieldOptions: YieldOptions, vaultFactory: VaultFactory, protocol: Protocol, chainId: number) {
  console.log(`deploying strategies using ${protocol} on network ${chainId}`);

  const strategy = strategies.find(strategy => strategy.protocol === protocol.key)
  const assets: Address[] = await yieldOptions.getProtocolAssets({ chainId, protocol: protocol.key })

  // Slice assets into smaller chucks to run parallel without hitting rate limits
  const chunkSize = 40;
  const assetChunks: Address[][] = []
  for (let i = 0; i < assets.length; i += chunkSize)
    assetChunks.push(assets.slice(i, i + chunkSize));

  // Deploy Strategies and store the result
  const result = {}
  for (let i = 0; i < assetChunks.length; i++) {
    await Promise.all(
      assetChunks[i].map(async (asset) => {
        try {
          await vaultFactory.createStrategyByKey({
            asset,
            initialDeposit: BigInt(0),
            strategy: strategy.key,
            options: { account: "0x22f5413C075Ccd56D575A54763831C4c27A37Bdb" }
          })
          result[asset] = { success: true, error: null }
        } catch (e) {
          result[asset] = { success: false, error: e }
        }
      })
    )
  }

  return result;
}
