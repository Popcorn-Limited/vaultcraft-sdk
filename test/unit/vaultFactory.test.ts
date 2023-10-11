import { describe, test, expect, beforeEach } from "vitest";
import { decodeFunctionData, Address } from "viem";

import { publicClient, walletClient } from "../setup";
import { increaseTime } from "../utils.js";

import { VaultControllerABI } from "../../src/abi/VaultControllerABI.js";
import { VaultFactory } from "../../src/vaultFactory.js";
import { VaultFees, WriteOptions, VaultOptions, VaultMetadata, AdapterOptions } from "../../src/types.js";

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

    // DEPLOY VAULT
    test("deployAVault() should deploy an adapter and a vault with the given VaultOptions, VaultMetadata, AdapterOptions, and WriteOptions.", async () => {
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
            staking: false,
            initialDeposit: BigInt(0)
        };

        const metadata: VaultMetadata = {
            metadataCID: "bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
            swapTokenAddresses: Array(8).fill(ZERO_ADDRESS) as [Address, Address, Address, Address, Address, Address, Address, Address],
            swapAddress: ZERO_ADDRESS,
            exchange: BigInt(0)
        };
        const adapter: AdapterOptions = {
            asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            adapterData: ["0x0000000000000000000000005dca0b3ed7594a6613c1a2acd367d56e1f74f92d", "0x0000000000000000000000000000000000000000000000000000000000000000"],
            strategyData: ["0x", "0x"],
            initialDeposit: BigInt(0)
        };
        const options: WriteOptions = {};

        const hash = await vaultFactory.deployVault(vault, metadata, adapter, options);
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

    test("proposeVaultAdapters() should propose the given adapters for the given vaults", async () => {
        const hash = await vaultFactory.proposeVaultAdapters([VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("proposeVaultAdapters");
        expect(args).toEqual([[VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"]]);
    });

    test("changeVaultAdapters() should change the adapters for the given vaults", async () => {
        // got to propose fees first before we can change them.
        await vaultFactory.proposeVaultAdapters([VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"], { account: ADMIN_ADDRESS });
        await increaseTime(86400 * 2);

        const hash = await vaultFactory.changeVaultAdapters([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("changeVaultAdapters");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    }, 10_000);

    // CHANGE FEES

    test("proposeVaultFees() should propose the fees for the given vaults", async () => {
        const fees: VaultFees = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            performance: BigInt(0),
            management: BigInt(10),
        };
        const hash = await vaultFactory.proposeVaultFees([VAULT_ADDRESS], [fees], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("proposeVaultFees");
        expect(args).toEqual([[VAULT_ADDRESS], [fees]]);
    });

    test("changeVaultFees() should return correct object", async () => {
        // got to propose fees first before we can change them.
        const fees: VaultFees = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            performance: BigInt(0),
            management: BigInt(10),
        };
        await vaultFactory.proposeVaultFees([VAULT_ADDRESS], [fees], { account: ADMIN_ADDRESS });
        await increaseTime(86400 * 2);

        const hash = await vaultFactory.changeVaultFees([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("changeVaultFees");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    test("setVaultFeeRecipients() should return correct object", async () => {
        const hash = await vaultFactory.setVaultFeeRecipients([VAULT_ADDRESS], [VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("setVaultFeeRecipients");
        expect(args).toEqual([[VAULT_ADDRESS], [VAULT_ADDRESS]]);
    });

    // PAUSING

    test("pauseVaults() should return correct object", async () => {
        const hash = await vaultFactory.pauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("pauseVaults");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    test("unpauseVaults() should return correct object", async () => {
        // got to pause first so that unpause doesn't revert
        await vaultFactory.pauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });

        const hash = await vaultFactory.unpauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("unpauseVaults");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    // OTHER

    test("setVaultDepositLimits() should return correct object", async () => {
        const hash = await vaultFactory.setVaultDepositLimits([VAULT_ADDRESS], [BigInt(10)], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("setVaultDepositLimits");
        expect(args).toEqual([[VAULT_ADDRESS], [BigInt(10)]]);
    });

    test("setVaultQuitPeriods() should return correct object", async () => {
        const newQuitPeriod = BigInt(86400 * 2);
        const hash = await vaultFactory.setVaultQuitPeriods([VAULT_ADDRESS], [newQuitPeriod], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vaultFactory.address.toLowerCase());
        expect(functionName).toBe("setVaultQuitPeriods");
        expect(args).toEqual([[VAULT_ADDRESS], [newQuitPeriod]]);
    });

});
