
import { Address, Hash, PublicClient } from "viem";
import {
  balancerLpCompounder,
  curveCompounder,
  curveStargateCompounder

} from "./resolver";

export type StrategyEncodingResolverParams = {
  client: PublicClient,
  address: Address,
  params: any[]
}

export type StrategyEncodingResolvers = typeof StrategyEncodingResolvers;

export const StrategyEncodingResolvers: { [key: string]: ({ client, address, params }: StrategyEncodingResolverParams) => Promise<Hash> } = {
  balancerLpCompounder,
  curveCompounder,
  curveStargateCompounder,
  convexCompounder: curveCompounder,
  auraCompounder: balancerLpCompounder
};

export default StrategyEncodingResolvers;