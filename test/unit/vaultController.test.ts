import { describe, test, expect, beforeEach } from "vitest";
import { decodeFunctionData, maxUint256, pad, zeroAddress } from "viem";

import { publicClient, walletClient } from "../setup.js";
import { increaseTime } from "../utils.js";

import { VaultControllerABI } from "../../src/abi/VaultControllerABI.js";
import { VaultController, VaultMetadata, VaultOptions } from "../../src/vaultController.js";
import { VaultFees } from "../../src/types.js";


let controller = new VaultController("0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb", publicClient, walletClient);
const FORK_BLOCK_NUMBER = BigInt(17883751);
const ADMIN_ADDRESS = "0x22f5413C075Ccd56D575A54763831C4c27A37Bdb";
const VAULT_ADDRESS = "0x5d344226578DC100b2001DA251A4b154df58194f";

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
    test("proposeVaultAdapters() should propose the given adapters for the given vaults", async () => {
        const hash = await controller.proposeVaultAdapters([VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("proposeVaultAdapters");
        expect(args).toEqual([[VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"]]);
    });

    // This test times out regulary. Increasing the timeout to 10 secs should fix that
    test("changeVaultAdapters() should change the adapters for the given vaults", async () => {
        // got to propose fees first before we can change them.
        await controller.proposeVaultAdapters([VAULT_ADDRESS], ["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"], { account: ADMIN_ADDRESS });
        await increaseTime(86400 * 2);

        const hash = await controller.changeVaultAdapters([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("changeVaultAdapters");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    }, 10_000);

    test("proposeVaultFees() should propose the fees for the given vaults", async () => {
        const fees: VaultFees = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            performance: BigInt(0),
            management: BigInt(10),
        };
        const hash = await controller.proposeVaultFees([VAULT_ADDRESS], [fees], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
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
        await controller.proposeVaultFees([VAULT_ADDRESS], [fees], { account: ADMIN_ADDRESS });
        await increaseTime(86400 * 2);

        const hash = await controller.changeVaultFees([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("changeVaultFees");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    test("setVaultQuitPeriods() should return correct object", async () => {
        const newQuitPeriod = BigInt(86400 * 2);
        const hash = await controller.setVaultQuitPeriods([VAULT_ADDRESS], [newQuitPeriod], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("setVaultQuitPeriods");
        expect(args).toEqual([[VAULT_ADDRESS], [newQuitPeriod]]);
    });

    test("setVaultFeeRecipients() should return correct object", async () => {
        const hash = await controller.setVaultFeeRecipients([VAULT_ADDRESS], [VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("setVaultFeeRecipients");
        expect(args).toEqual([[VAULT_ADDRESS], [VAULT_ADDRESS]]);
    });

    test("pauseVaults() should return correct object", async () => {
        const hash = await controller.pauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("pauseVaults");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    test("unpauseVaults() should return correct object", async () => {
        // got to pause first so that unpause doesn't revert
        await controller.pauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });

        const hash = await controller.unpauseVaults([VAULT_ADDRESS], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("unpauseVaults");
        expect(args).toEqual([[VAULT_ADDRESS]]);
    });

    test("setVaultDepositLimits() should return correct object", async () => {
        const hash = await controller.setVaultDepositLimits([VAULT_ADDRESS], [BigInt(10)], { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("setVaultDepositLimits");
        expect(args).toEqual([[VAULT_ADDRESS], [BigInt(10)]]);
    });
    test("deployVault() should deploy a new vault", async () => {
        const asset = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        const adapter = "0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc";
        const vaultOptions: VaultOptions = {
            asset,
            adapter,
            fees: { deposit: 0n, withdrawal: 0n, management: 0n, performance: 100n },
            feeRecipient: ADMIN_ADDRESS,
            owner: ADMIN_ADDRESS,
            staking: false,
            initialDeposit: 0n,
        };

        const metadata: VaultMetadata = {
            metadataCID: "",
            swapTokenAddresses: [zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress],
            swapAddress: zeroAddress,
            exchange: 0n,
        };

        const hash = await controller.createVault(vaultOptions, metadata, { account: ADMIN_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: VaultControllerABI,
            data: tx.input,
        });

        expect(tx.from).toBe(ADMIN_ADDRESS.toLowerCase());
        expect(tx.to).toBe(controller.address.toLowerCase());
        expect(functionName).toBe("deployVault");
        expect(args).toEqual([
            {
                asset,
                adapter,
                fees: { deposit: 0n, withdrawal: 0n, management: 0n, performance: 100n },
                feeRecipient: ADMIN_ADDRESS,
                owner: ADMIN_ADDRESS,
                depositLimit: maxUint256 - 1n,
            },
            {
                id: pad("0x"),
                data: "0x",
            },
            {
                id: pad("0x"),
                data: "0x",
            },
            false,
            "0x",
            {
                metadataCID: "",
                swapTokenAddresses: [zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress],
                swapAddress: zeroAddress,
                exchange: 0n,
                // these three will be overriden by the VaultController. Specifying them here is pointless.
                // But, we have to include them in the type so that viem doesn't throw an error
                vault: zeroAddress,
                staking: zeroAddress,
                creator: zeroAddress,
            },
            0n,
        ]);
    });
}, 10_000);
