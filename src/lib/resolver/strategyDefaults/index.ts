
import {
  curveStargateCompounder,
  curveCompounder,
  balancerLpCompounder
} from "./resolver/index.js";

export type StrategyDefaultResolver = (
  chainId: number,
  rpcUrl: string,
  address: string,
  adapter: string
) => Promise<any>;

export type StrategyDefaultResolvers = typeof StrategyDefaultResolvers;

export const StrategyDefaultResolvers: { [key: string]: ({ chainId, rpcUrl, address, adapter }: { chainId: number, rpcUrl: string, address: string, adapter: string }) => Promise<any[]> } = {
  curveStargateCompounder,
  curveCompounder,
  balancerLpCompounder
};

export default StrategyDefaultResolvers;