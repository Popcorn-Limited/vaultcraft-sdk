
import { Address, PublicClient } from "viem";
import {
  alpacaV1,
  alpacaV2,
  aura,
  auraCompounder,
  balancer,
  balancerLpCompounder,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  convexCompounder,
  curve,
  curveCompounder,
  curveStargateCompounder,
  initDefault,
  ellipsis,
  flux,
  gearbox,
  idle,
  origin,
  stargate,
  velodrome,
  yearn,
} from "./resolver";

export type ParamAbi = {
  name: string;
  type: string;
  internalType?: string;
}

export type ParamDefault = {
  name: string;
  value: any;
}

export type StrategyDefault = {
  key: string;
  params: ParamAbi[];
  default: ParamDefault[];
}

export type StrategyDefaultResolverParams = {
  chainId: number,
  client: PublicClient,
  address: Address
}

export type StrategyDefaultResolvers = typeof StrategyDefaultResolvers;

export const ERROR_RESPONSE = {
  key: "error",
  params: [{ name: "error", type: "null" }],
  default: [{ name: "error", value: null }]
}

export const StrategyDefaultResolvers: { [key: string]: ({ chainId, client, address }: StrategyDefaultResolverParams) => Promise<StrategyDefault> } = {
  alpacaV1,
  alpacaV2,
  aura,
  auraCompounder,
  balancer,
  balancerLpCompounder,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  convexCompounder,
  curve,
  curveCompounder,
  curveStargateCompounder,
  initDefault,
  ellipsis,
  flux,
  gearbox,
  idle,
  origin,
  stargate,
  velodrome,
  yearn,
};

export default StrategyDefaultResolvers;