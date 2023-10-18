import type { Address, Account, AccessList, Hex } from "viem";

export type WriteOptions = {
    account?: Address | Account;
    accessList?: AccessList;
    dataSuffix?: Hex;
    gasPrice?: bigint;
    nonce?: number;
};

export type VaultFees = {
    deposit: bigint;
    withdrawal: bigint;
    management: bigint;
    performance: bigint;
};

export type Vault = {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    asset: Address;
    adapter: Address;
    totalAssets: bigint;
    totalSupply: bigint;
    pricePerShare: bigint;
    fees: VaultFees;
    depositLimit: bigint;
    creator: Address;
    metadataCID: string;
}

export type VaultOptions = {
    asset: Address;
    adapter: Address;
    fees: VaultFees;
    feeRecipient: Address;
    depositLimit: bigint;
    owner: Address;
    initialDeposit: bigint;
};

export type Metadata = {
    vault: Address;
    staking: Address;
    creator: Address;
    metadataCID: string;
    swapAddress: Address;
    exchange: bigint;
}