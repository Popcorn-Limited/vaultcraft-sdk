import { Address, ParseAbi, PublicClient, WriteContractParameters, parseAbi } from "viem";
import { IVaultABI } from "./abi/IVault";

const ABI = IVaultABI;

type Fees = {
    deposit: bigint;
    withdrawal: bigint;
    management: bigint;
    performance: bigint;
};

export class Vault {
    address: Address;
    private client: PublicClient;
    private baseObj;

    constructor(address: Address, publicClient: PublicClient) {
        this.address = address;
        this.client = publicClient;
        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    // ERC4626

    totalSupply(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "totalSupply",
        });
    }

    totalAssets(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "totalAssets",
        });
    }

    balanceOf(who: Address): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "balanceOf",
            args: [who],
        });
    }

    asset(): Promise<Address> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "asset",
        });
    }

    convertToShares(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "convertToShares",
            args: [amount],
        });
    }

    convertToAssets(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "convertToAssets",
            args: [amount],
        });
    }

    maxDeposit(receiver: Address): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "maxDeposit",
            args: [receiver],
        });
    }

    maxMint(receiver: Address): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "maxMint",
            args: [receiver],
        });
    }

    maxWithdraw(owner: Address): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "maxWithdraw",
            args: [owner],
        });
    }

    maxRedeem(owner: Address): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "maxRedeem",
            args: [owner],
        });
    }

    previewDeposit(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "previewDeposit",
            args: [amount],
        });
    }

    previewMint(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "previewMint",
            args: [amount],
        });
    }

    previewWithdraw(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "previewWithdraw",
            args: [amount],
        });
    }

    previewRedeem(amount: bigint): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "previewRedeem",
            args: [amount],
        });
    }

    getDepositReq(account: Address, amount: bigint, receiver: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "deposit",
            args: [amount, receiver],
        };
    }

    getMintReq(account: Address, shares: bigint, receiver: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "mint",
            args: [shares, receiver],
        };
    }

    getWithdrawReq(account: Address, amount: bigint, receiver: Address, owner: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "withdraw",
            args: [amount, receiver, owner],
        };
    }

    getRedeemReq(account: Address, shares: bigint, receiver: Address, owner: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "redeem",
            args: [shares, receiver, owner],
        };
    }

    // Vault

    adapter(): Promise<Address> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "adapter",
        });
    }

    proposedAdapter(): Promise<Address> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "proposedAdapter",
        });
    }

    proposedAdapterTime(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "proposedAdapterTime",
        });
    }

    getProposeAdapterReq(account: Address, adapter: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "proposeAdapter",
            args: [adapter],
        };
    }

    getChangeAdapterReq(account: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "changeAdapter",
        };
    }

    fees(): Promise<Fees> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "fees",
        });
    }

    proposedFees(): Promise<Fees> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "proposedFees",
        });
    }

    proposedFeeTime(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "proposedFeeTime",
        });
    }

    getProposeFeesReq(account: Address, fees: Fees): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "proposeFees",
            args: [fees],
        };
    }

    getChangeFeesReq(account: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "changeFees",
        };
    }

    getSetFeeRecipientReq(account: Address, recipient: Address): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setFeeRecipient",
            args: [recipient],
        };
    }

    quitPeriod(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "quitPeriod",
        });
    }

    getSetQuitPeriodReq(account: Address, quitPeriod: bigint): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setQuitPeriod",
            args: [quitPeriod],
        };
    }

    depositLimit(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "depositLimit",
        });
    }

    getSetDepositLimitReq(account: Address, limit: bigint): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setDepositLimit",
            args: [limit],
        };
    }

    accruedManagementFee(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "accruedManagementFee",
        });
    }

    accruedPerformanceFee(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "accruedPerformanceFee",
        });
    }

    highWaterMark(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "highWaterMark",
        });
    }

    feeUpdatedAt(): Promise<bigint> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "feesUpdatedAt"
        });
    }

    feeRecipient(): Promise<Address> {
        return this.client.readContract({
            ...this.baseObj,
            functionName: "feeRecipient",
        });
    }
}