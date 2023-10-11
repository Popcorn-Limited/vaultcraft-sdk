import { Hash } from "crypto";
import { Address } from "viem";

export type InitParamRequirement = "Required" | 'NotAddressZero' | 'NotZero';

export type InitParam = {
  name: string;
  type: string;
  requirements?: InitParamRequirement[];
  description?: string;
  multiple?: boolean;
};

export type Strategy = {
  name: string;
  key: string;
  logoURI: string;
  protocol: string;
  description: string;
  chains: number[];
  initParams?: InitParam[];
  resolver?: string;
  adapter?: string;
};

export type SimulationResponse = {
  request: any | undefined,
  success: boolean,
  error: string | undefined
}

export type StrategyData = {
  id: `0x${string}`,
  data: `0x${string}`
}