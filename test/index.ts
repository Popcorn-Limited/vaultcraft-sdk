import { createPool } from "@viem/anvil";
import { Address, Chain, Transport, WalletClient, createPublicClient, createWalletClient, http } from "viem";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { mainnet, polygon, arbitrum, optimism } from "viem/chains";
import strategies from "../src/lib/constants/strategies";
import { VaultFactory } from "../src/vaultFactory/vaultFactory";
import { CachedProvider, Protocol, YieldOptions } from "../src/yieldOptions/index";
import { privateKeyToAccount } from 'viem/accounts'
import { Strategy } from "../src/vaultFactory";

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
  const sampleProtocol: Protocol = {
    name: "Beefy",
    key: "beefy",
    logoURI: "https://cryptologos.cc/logos/beefy-finance-bifi-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1, 137, 10, 42161, 56]
  }
  const protocols = [sampleProtocol] //yieldOptions.getProtocols(1)
  const result: { [key: string]: any } = {}

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

async function createClient(chain: Chain, forkUrl: string, port: number) {
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
  const publicClient = createPublicClient({
    chain: anvilChain,
    transport: http(),
  });

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

  const walletClient = createWalletClient({
    account,
    chain: anvilChain,
    transport: http(),
  })

  return { publicClient, walletClient };
}

async function deployStrategiesForProtocol(yieldOptions: YieldOptions, vaultFactory: VaultFactory, protocol: Protocol, chainId: number) {
  console.log(`deploying strategies using ${protocol.key} on network ${chainId}`);

  const strategy = Object.keys(strategies).map(key => { return { strategy: strategies[key], key: key } }).find(strategy => strategy.strategy.protocol === protocol.key)
  const assets: Address[] = ["0x3FA8C89704e5d07565444009e5d9e624B40Be813"] //await yieldOptions.getProtocolAssets({ chainId, protocol: protocol.key })

  // Slice assets into smaller chucks to run parallel without hitting rate limits
  const chunkSize = 40;
  const assetChunks: Address[][] = []
  for (let i = 0; i < assets.length; i += chunkSize)
    assetChunks.push(assets.slice(i, i + chunkSize));

  // Deploy Strategies and store the result
  const result: { [key: Address]: { success: boolean, error: any | null } } = {}
  for (let i = 0; i < assetChunks.length; i++) {
    await Promise.all(
      assetChunks[i].map(async (asset) => {
        try {
          await vaultFactory.createStrategyByKey({
            asset,
            initialDeposit: BigInt(0),
            strategy: strategy?.key as string,
            options: { account: "0x22f5413C075Ccd56D575A54763831C4c27A37Bdb" }
          })
          result[asset] = { success: true, error: null }
        } catch (e: any) {
          result[asset] = { success: false, error: e }
        }
      })
    )
  }

  return result;
}
