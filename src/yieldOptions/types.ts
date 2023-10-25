import { Address } from "viem";

export interface RpcUrls {
  [chain: number]: string;
}

export interface YieldData {
  [chain: number]: Chain;
}

export interface Chain {
  assetsByProtocol: {
    [protocol: string]: YieldOption[];
  };
  protocolsByAsset: {
    [asset: string]: string[];
  };
  assetAddresses: string[];
  protocols: string[];
}

export interface YieldOption {
  asset: string;
  yield: Yield;
}

export interface Yield {
  total: number;
  apy?: Apy[];
}

export interface Apy {
  rewardToken: string;
  apy: number;
}

export type Adapter = {
  name: string;
  key: string;
  logoURI: string;
  protocol: string;
  assets: string[];
  chains: number[];
  initParams?: InitParam[];
  resolver?: string;
};

export type InitParam = {
  name: string;
  type: string;
  requirements?: InitParamRequirement[];
  description?: string;
  multiple?: boolean;
};

export enum InitParamRequirement {
  "Required",
  "NotAddressZero",
  "NotZero",
}

// @dev Dont forget to add the protocol name in here after adding a new one
export type ProtocolName = 'aaveV2' | 'aaveV3' | 'aura' | 'balancer' | 'beefy' | 'compoundV2' | 'compoundV3'
  | 'convex' | 'curve' | 'flux' | 'idleJunior' | 'idleSenior' | 'origin' | 'stargate' | 'yearn' | 'yearnFactory';

export type Protocol = {
  name: string;
  key: ProtocolName;
  logoURI: string;
  description: string;
  tags: string[];
  chains: number[];
}

export type ChainToAddress = { [key: number]: Address };

export interface IProtocolProvider {
  getProtocols(chainId: number): Protocol[];
  getProtocolAssets({ chainId, protocol }: { chainId: number, protocol: ProtocolName }): Promise<Address[]>;
  getApy({ chainId, protocol, asset }: { chainId: number, protocol: ProtocolName, asset: Address }): Promise<Yield>;
}