import { Address, PublicClient, SimulateContractReturnType, WalletClient, WriteContractParameters, WriteContractReturnType } from "viem";
import { IVaultABI } from "./abi/IVault";

const ABI = IVaultABI;

export class Vault {
    address: Address;
    private client: PublicClient;

    constructor(address: Address, publicClient: PublicClient) {
        this.address = address;
        this.client = publicClient;
    }

    // The type of `args` and return value are unknown. But, the function
    // that calls `read()`, which is exposed to the user should know them.
    private read(functionName: string, args: unknown[]): Promise<unknown> {
        return this.client.readContract({
            functionName,
            args,
            address: this.address,
            abi: ABI,
        });
    }

    totalSupply(): Promise<BigInt> {
        return this.read("totalSupply", []) as Promise<BigInt>;
    }

    totalAssets(): Promise<BigInt> {
        return this.read("totalAssets", []) as Promise<BigInt>;
    }

    balanceOf(who: Address): Promise<BigInt> {
        return this.read("balanceOf", [who]) as Promise<BigInt>;
    }

    adapter(): Promise<Address> {
        return this.read("adapter", []) as Promise<Address>;
    }

    getDepositReq(account: Address, amount: BigInt, receiver: Address): WriteContractParameters {
        return {
            account,
            address: this.address,
            functionName: "deposit",
            abi: ABI,
            args: [amount, receiver],
        };
    }

    getMintReq(account: Address, shares: BigInt, receiver: Address): WriteContractParameters {
        return {
            account,
            address: this.address,
            functionName: "mint",
            abi: ABI,
            args: [shares, receiver],
        };
    }

    getWithdrawReq(account: Address, amount: BigInt, receiver: Address, owner: Address): WriteContractParameters {
        return {
            account,
            address: this.address,
            functionName: "withdraw",
            abi: ABI,
            args: [amount, receiver, owner],
        };
    }

    getRedeemReq(account: Address, shares: BigInt, receiver: Address, owner: Address): WriteContractParameters {
        return {
            account,
            address: this.address,
            functionName: "redeem",
            abi: ABI,
            args: [shares, receiver, owner],
        };
    }
}