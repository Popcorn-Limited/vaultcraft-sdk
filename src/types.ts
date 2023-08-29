import { Address, Account, AccessList, Hex } from "viem";

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

