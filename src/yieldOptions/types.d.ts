
export interface YieldData {
  [chain: number]: Chain
}

export interface Chain {
  [protocol: string]: Asset[];
  [asset: string]: Asset;
  assetAddresses: string[];
  protocols: string[];
}

export interface Asset {
  address: string;
  yield?: Yield[];
}

export interface Yield {
  total: number;
  apy: Apy[];
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