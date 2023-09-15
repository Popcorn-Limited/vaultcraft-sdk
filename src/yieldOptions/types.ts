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
  address: string;
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

export type ProtocolName = 'aaveV2' | 'aaveV3' | 'aura' | 'beefy' | 'compoundV2' | 'curve' | 'idle' | 'origin' | 'yearn';
