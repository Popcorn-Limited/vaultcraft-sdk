import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "..";

export async function initDefault({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  return ERROR_RESPONSE
}