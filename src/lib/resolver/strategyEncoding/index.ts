
import {
  curveStargateCompounder,
  curveCompounder,
  balancerLpCompounder
} from "./resolver/index.js";

export type StrategyEncodingResolver = (
  chainId: number,
  rpcUrl: string,
  address: string,
  params: any[],
) => Promise<string>;

export type StrategyEncodingResolvers = typeof StrategyEncodingResolvers;

export const StrategyEncodingResolvers: { [key: string]: ({ chainId, rpcUrl, address, params }: { chainId: number, rpcUrl: string, address: string, params: any[] }) => Promise<string> } = {
  curveStargateCompounder,
  curveCompounder,
  balancerLpCompounder
};

export default StrategyEncodingResolvers;