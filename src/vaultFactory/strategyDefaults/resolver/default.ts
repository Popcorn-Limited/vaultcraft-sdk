import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

export async function initDefault({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  return {
    params: [],
    default: []
  }
}