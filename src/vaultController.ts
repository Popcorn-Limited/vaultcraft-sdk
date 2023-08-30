import type { Hash, Address, PublicClient, WalletClient, Transport, Chain } from "viem";

import { VaultControllerABI } from "./abi/VaultControllerABI.js";
import { Base } from "./base.js";
import type { VaultFees, WriteOptions } from "./types.js";

const ABI = VaultControllerABI;

export class VaultController extends Base {
    private baseObj;

    constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain>) {
        super(address, publicClient, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    async proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultAdapters",
            args: [vaults, adapters],
        });
        return this.walletClient.writeContract(request);
    }

    async changeVaultAdapters(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultAdapters",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async proposeVaultFees(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultFees",
            args: [vaults, fees],
        });
        return this.walletClient.writeContract(request);
    }

    async changeVaultFees(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultFees",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async setVaultQuitPeriods(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultQuitPeriods",
            args: [vaults, quitPeriods],
        });
        return this.walletClient.writeContract(request);
    }

    async setVaultFeeRecipients(vaults: Address[], recipients: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultFeeRecipients",
            args: [vaults, recipients],
        });
        return this.walletClient.writeContract(request);
    }

    async pauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "pauseVaults",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async unpauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "unpauseVaults",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async setVaultDepositLimits(vaults: Address[], limits: bigint[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultDepositLimits",
            args: [vaults, limits],
        });
        return this.walletClient.writeContract(request);
    }
}