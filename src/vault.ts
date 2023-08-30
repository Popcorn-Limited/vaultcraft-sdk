import type { Address, PublicClient, WalletClient, Transport, Hash, Chain } from "viem";
import { IVaultABI } from "./abi/IVaultABI.js";
import { Base } from "./base.js";
import type { WriteOptions, VaultFees } from "./types.js";

const ABI = IVaultABI;

export class Vault extends Base {
    private baseObj;

    constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain>) {
        super(address, publicClient, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    // ERC4626

    totalSupply(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "totalSupply",
        });
    }

    totalAssets(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "totalAssets",
        });
    }

    balanceOf(who: Address): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "balanceOf",
            args: [who],
        });
    }

    asset(): Promise<Address> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "asset",
        });
    }

    convertToShares(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "convertToShares",
            args: [amount],
        });
    }

    convertToAssets(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "convertToAssets",
            args: [amount],
        });
    }

    maxDeposit(receiver: Address): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "maxDeposit",
            args: [receiver],
        });
    }

    maxMint(receiver: Address): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "maxMint",
            args: [receiver],
        });
    }

    maxWithdraw(owner: Address): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "maxWithdraw",
            args: [owner],
        });
    }

    maxRedeem(owner: Address): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "maxRedeem",
            args: [owner],
        });
    }

    previewDeposit(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "previewDeposit",
            args: [amount],
        });
    }

    previewMint(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "previewMint",
            args: [amount],
        });
    }

    previewWithdraw(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "previewWithdraw",
            args: [amount],
        });
    }

    previewRedeem(amount: bigint): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "previewRedeem",
            args: [amount],
        });
    }

    async deposit(amount: bigint, receiver: Address, options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deposit",
            args: [amount, receiver],
        });

        return this.walletClient.writeContract(request);
    };

    async mint(amount: bigint, receiver: Address, options: WriteOptions) {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "mint",
            args: [amount, receiver],
        });
        return this.walletClient.writeContract(request);
    }

    async withdraw(amount: bigint, receiver: Address, owner: Address, options: WriteOptions) {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "withdraw",
            args: [amount, receiver, owner],
        });
        return this.walletClient.writeContract(request);
    }

    async redeem(amount: bigint, receiver: Address, owner: Address, options: WriteOptions) {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "redeem",
            args: [amount, receiver, owner],
        });
        return this.walletClient.writeContract(request);
    }

    // Vault

    adapter(): Promise<Address> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "adapter",
        });
    }

    proposedAdapter(): Promise<Address> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "proposedAdapter",
        });
    }

    proposedAdapterTime(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "proposedAdapterTime",
        });
    }

    fees(): Promise<VaultFees> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "fees",
        });
    }

    proposedFees(): Promise<VaultFees> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "proposedFees",
        });
    }

    proposedFeeTime(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "proposedFeeTime",
        });
    }

    quitPeriod(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "quitPeriod",
        });
    }

    depositLimit(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "depositLimit",
        });
    }

    accruedManagementFee(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "accruedManagementFee",
        });
    }

    accruedPerformanceFee(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "accruedPerformanceFee",
        });
    }

    highWaterMark(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "highWaterMark",
        });
    }

    feeUpdatedAt(): Promise<bigint> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "feesUpdatedAt"
        });
    }

    feeRecipient(): Promise<Address> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "feeRecipient",
        });
    }
}