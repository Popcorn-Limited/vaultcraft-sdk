import type { Hash, Address, PublicClient, WalletClient, Transport, Chain } from "viem";
import type { VaultFees, WriteOptions } from "./types.js";

import { VaultControllerABI } from "./abi/VaultControllerABI.js";
import { Base } from "./base.js";

const ABI = VaultControllerABI;

export class VaultController extends Base {
    private baseObj;

    constructor({ address, publicClient, walletClient }: { address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain> }) {
        super(address, publicClient, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    // CHANGE ADAPTER

    async proposeVaultAdapters({ vaults, adapters, options }: { vaults: Address[], adapters: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultAdapters",
            args: [vaults, adapters],
        });
        return this.walletClient.writeContract(request);
    }

    async changeVaultAdapters({ vaults, options }: { vaults: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultAdapters",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    // CHANGE FEES

    async proposeVaultFees({ vaults, fees, options }: { vaults: Address[], fees: VaultFees[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultFees",
            args: [vaults, fees],
        });
        return this.walletClient.writeContract(request);
    }

    async changeVaultFees({ vaults, options }: { vaults: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultFees",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async setVaultFeeRecipients({ vaults, recipients, options }: { vaults: Address[], recipients: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultFeeRecipients",
            args: [vaults, recipients],
        });
        return this.walletClient.writeContract(request);
    }

    // PAUSING

    async pauseVaults({ vaults, options }: { vaults: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "pauseVaults",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    async unpauseVaults({ vaults, options }: { vaults: Address[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "unpauseVaults",
            args: [vaults],
        });
        return this.walletClient.writeContract(request);
    }

    // OTHER

    async setVaultDepositLimits({ vaults, limits, options }: { vaults: Address[], limits: bigint[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultDepositLimits",
            args: [vaults, limits],
        });
        return this.walletClient.writeContract(request);
    }

    async setVaultQuitPeriods({ vaults, quitPeriods, options }: { vaults: Address[], quitPeriods: bigint[], options: WriteOptions }): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultQuitPeriods",
            args: [vaults, quitPeriods],
        });
        return this.walletClient.writeContract(request);
    }
}