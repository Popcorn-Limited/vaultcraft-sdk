
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
} from "./resolver/index.js";

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
  params: ParamAbi[];
  default: ParamDefault[];
}

export type StrategyDefaultResolverParams = {
  client: PublicClient,
  address: Address
}

export type StrategyDefaultResolvers = typeof StrategyDefaultResolvers;

export const ERROR_RESPONSE = {
  params: [{ name: "error", type: "null" }],
  default: [{ name: "error", value: null }]
}

export const StrategyDefaultResolvers: { [key: string]: ({ client, address }: StrategyDefaultResolverParams) => Promise<StrategyDefault> } = {
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
  flux,
  gearbox,
  idle,
  origin,
  stargate,
  yearn,
  aaveV2: initDefault,
  aaveV3: initDefault,
  default: initDefault,
};

export default StrategyDefaultResolvers;