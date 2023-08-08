export interface RpcUrls {
  [chain: number]: string;
}

export interface YieldData {
  [chain: number]: Chain;
}

export interface Chain {
  assetsByProtocol: {
    [protocol: string]: Asset[];
  };
  protocolsByAsset: {
    [asset: string]: string[];
  };
  assetAddresses: string[];
  protocols: string[];
}

export interface Asset {
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

type InitParam = {
  name: string;
  // TODO: this could be improved to be more specific since we know all possible type strings
  type: string;
  requirements: string[];
  description: string;
};

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