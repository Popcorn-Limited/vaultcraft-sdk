import type { Address, Account, AccessList, Hex, Hash } from "viem";

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

export type VaultOptions = {
    asset: Address;
    adapter: Address;
    fees: VaultFees;
    feeRecipient: Address;
    depositLimit?: bigint;
    owner: Address;
    staking: boolean;
    initialDeposit: bigint;
};

export type VaultMetadata = {
    metadataCID: string;
    swapTokenAddresses: [Address, Address, Address, Address, Address, Address, Address, Address];
    swapAddress: Address;
    exchange: bigint;
};

export type AdapterOptions = {
    asset: Address,
    adapterData: [Hash, Hash];
    strategyData: [Hash, Hash];
    initialDeposit: bigint;
}
