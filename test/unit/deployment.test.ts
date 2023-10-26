import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import { zeroAddress, decodeFunctionData } from "viem";

import { publicClient, walletClient } from "../setup";
import { Address, Chain, Transport, WalletClient, createPublicClient, createWalletClient, http } from "viem";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { mainnet, polygon, arbitrum, optimism } from "viem/chains";
import strategies from "../../src/lib/constants/strategies";
import { VaultFactory } from "../../src/vaultFactory/vaultFactory";
import { CachedProvider, Protocol, YieldOptions } from "../../src/yieldOptions/index";
import { privateKeyToAccount } from 'viem/accounts'
import { Strategy } from "../../src/vaultFactory";

const ARCHIVE_PATH = "./archive";
const FORK_BLOCK_NUMBER = BigInt(18433934);
// some random address that has a lot of ETH & DAI
const ADMIN_ADDRESS = "0x6FF8E4DB500cBd77d1D181B8908E022E29e0Ec4A";

async function deployStrategiesForProtocol(yieldOptions: YieldOptions, vaultFactory: VaultFactory, protocol: Protocol, chainId: number) {
  console.log(`deploying strategies using ${protocol.key} on network ${chainId}`);

  const strategy = Object.keys(strategies).map(key => { return { strategy: strategies[key], key: key } }).find(strategy => strategy.strategy.protocol === protocol.key)
  const assets: Address[] = ["0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC", "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56"] //await yieldOptions.getProtocolAssets({ chainId, protocol: protocol.key })

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
            options: { account: ADMIN_ADDRESS }
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

describe("read-only", () => {
  beforeEach(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
    await walletClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });

    // public client has to impersonate as well because of the simulation request
    await publicClient.impersonateAccount({
      address: ADMIN_ADDRESS
    });
    await walletClient.impersonateAccount({
      address: ADMIN_ADDRESS
    });
  });

  test("test deployment per asset", async () => {
    // Set up classes
    const provider = new CachedProvider();
    await provider.initialize("https://raw.githubusercontent.com/Popcorn-Limited/apy-data/main/apy-data.json");
    const yieldOptions = new YieldOptions({ provider, ttl: 1000 });

    const vaultFactory = new VaultFactory({
      address: "0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb",
      publicClient: publicClient,
      walletClient: walletClient as WalletClient<Transport, Chain>
    })


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

    await Promise.all(protocols.map(async protocol => {
      const res = await deployStrategiesForProtocol(yieldOptions, vaultFactory, protocol, 1);
      result[protocol.key] = res;
    }))

    console.log("saving result in new json");
    if (!existsSync(ARCHIVE_PATH)) {
      mkdirSync(ARCHIVE_PATH);
    }
    const date = new Date().toISOString().slice(0, 10)

    writeFileSync(`${ARCHIVE_PATH}/${date}-deployment-test.json`, JSON.stringify(result), "utf-8");
    return true
  }, 100_000)
})