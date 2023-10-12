import { describe, test, expect, beforeEach } from "vitest";
import { decodeFunctionData, Address } from "viem";

import { publicClient, walletClient } from "../setup";

import { VaultControllerABI } from "../../src/abi/VaultControllerABI.js";
import { StrategyData, VaultFactory } from "../../src/vaultFactory";
import { WriteOptions, VaultOptions, VaultMetadata } from "../../src/types.js";
import { MAX_UINT256 } from "../../src/lib/constants";

let vaultFactory = new VaultFactory("0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb", publicClient, walletClient);
const FORK_BLOCK_NUMBER = BigInt(17883751);
// some random address that has a lot of ETH & DAI
const ADMIN_ADDRESS = "0x22f5413C075Ccd56D575A54763831C4c27A37Bdb";
const VAULT_ADDRESS = "0x5d344226578DC100b2001DA251A4b154df58194f";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("write-only", () => {
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

  // CREATE VAULT
  test("createVault() should deploy a strategy and a vault if strategy address is 0", async () => {
    const vault: VaultOptions = {
      asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      adapter: ZERO_ADDRESS,
      fees: {
        deposit: BigInt(0),
        withdrawal: BigInt(0),
        management: BigInt(0),
        performance: BigInt(0)
      },
      feeRecipient: ADMIN_ADDRESS,
      owner: ADMIN_ADDRESS,
      initialDeposit: BigInt(0),
      depositLimit: MAX_UINT256
    };

    const metadata: VaultMetadata = {
      metadataCID: "bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
      swapTokenAddresses: Array(8).fill(ZERO_ADDRESS) as [Address, Address, Address, Address, Address, Address, Address, Address],
      swapAddress: ZERO_ADDRESS,
      exchange: BigInt(0)
    };
    const adapter: StrategyData = {
      id: "0x0000000000000000000000005dca0b3ed7594a6613c1a2acd367d56e1f74f92d",
      data: "0x"
    }
    const strategy: StrategyData = {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    }
    const options: WriteOptions = {};

    const hash = await vaultFactory.createVault({ vault, adapterData: adapter, strategyData: strategy, metadata, options });
    const tx = await publicClient.getTransaction({
      hash,
    });

    const { functionName, args } = decodeFunctionData({
      abi: VaultControllerABI,
      data: tx.input,
    });

    expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
    expect(tx.to).toBe(vaultFactory.address.toLowerCase());
    expect(functionName).toBe("deployVault");
  })


  test("createVault() should deploy a vault and use a preexisting strategy if a strategy address is given", async () => {
    const vault: VaultOptions = {
      asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      adapter: "0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc",
      fees: {
        deposit: BigInt(0),
        withdrawal: BigInt(0),
        management: BigInt(0),
        performance: BigInt(0)
      },
      feeRecipient: ADMIN_ADDRESS,
      owner: ADMIN_ADDRESS,
      initialDeposit: BigInt(0),
      depositLimit: MAX_UINT256
    };

    const metadata: VaultMetadata = {
      metadataCID: "bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
      swapTokenAddresses: Array(8).fill(ZERO_ADDRESS) as [Address, Address, Address, Address, Address, Address, Address, Address],
      swapAddress: ZERO_ADDRESS,
      exchange: BigInt(0)
    };
    const adapter: StrategyData = {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    }
    const strategy: StrategyData = {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    }
    const options: WriteOptions = {};

    const hash = await vaultFactory.createVault({ vault, adapterData: adapter, strategyData: strategy, metadata, options });
    const tx = await publicClient.getTransaction({
      hash,
    });

    const { functionName, args } = decodeFunctionData({
      abi: VaultControllerABI,
      data: tx.input,
    });

    expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
    expect(tx.to).toBe(vaultFactory.address.toLowerCase());
    expect(functionName).toBe("deployVault");
  })


  // CREATE STRATEGY
  test("createStrategy() should deploy a strategy", async () => {
    const adapter: StrategyData = {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    }
    const strategy: StrategyData = {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    }
    const options: WriteOptions = {};

    const hash = await vaultFactory.createStrategy({ asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F", adapterData: adapter, strategyData: strategy, initialDeposit: BigInt(0) });
    const tx = await publicClient.getTransaction({
      hash,
    });

    const { functionName, args } = decodeFunctionData({
      abi: VaultControllerABI,
      data: tx.input,
    });

    expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
    expect(tx.to).toBe(vaultFactory.address.toLowerCase());
    expect(functionName).toBe("deployAdapter");
  })


  // CREATE VAULT BY KEY
  test("createVaultByKey() should deploy a strategy and a vault", async () => {
    const vault: VaultOptions = {
      asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      adapter: ZERO_ADDRESS,
      fees: {
        deposit: BigInt(0),
        withdrawal: BigInt(0),
        management: BigInt(0),
        performance: BigInt(0)
      },
      feeRecipient: ADMIN_ADDRESS,
      owner: ADMIN_ADDRESS,
      initialDeposit: BigInt(0),
      depositLimit: MAX_UINT256
    };

    const metadata: VaultMetadata = {
      metadataCID: "bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
      swapTokenAddresses: Array(8).fill(ZERO_ADDRESS) as [Address, Address, Address, Address, Address, Address, Address, Address],
      swapAddress: ZERO_ADDRESS,
      exchange: BigInt(0)
    };

    const hash = await vaultFactory.createVaultByKey({ vault, metadata, strategy: "yearn" });
    const tx = await publicClient.getTransaction({
      hash,
    });

    const { functionName, args } = decodeFunctionData({
      abi: VaultControllerABI,
      data: tx.input,
    });

    expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
    expect(tx.to).toBe(vaultFactory.address.toLowerCase());
    expect(functionName).toBe("deployVault");
  })

  // CREATE STRATEGY BY KEY
  test("createStrategyByKey() should deploy a strategy", async () => {
    const hash = await vaultFactory.createStrategyByKey({ asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F", initialDeposit: BigInt(0), strategy: "yearn" });
    const tx = await publicClient.getTransaction({
      hash,
    });

    const { functionName, args } = decodeFunctionData({
      abi: VaultControllerABI,
      data: tx.input,
    });

    expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
    expect(tx.to).toBe(vaultFactory.address.toLowerCase());
    expect(functionName).toBe("deployAdapter");
  })
});