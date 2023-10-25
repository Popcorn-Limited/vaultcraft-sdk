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

export type Token = {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    balance: bigint;
    price: bigint;
};

// @dev Dont forget to add the protocol name in here after adding a new one
export type ProtocolName = 'aaveV2' | 'aaveV3' | 'aura' | 'balancer' | 'beefy' | 'compoundV2' | 'compoundV3'
  | 'convex' | 'curve' | 'flux' | 'idleJunior' | 'idleSenior' | 'origin' | 'stargate' | 'yearn';
