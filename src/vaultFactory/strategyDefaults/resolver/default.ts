import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

export async function initDefault({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  return ERROR_RESPONSE
}