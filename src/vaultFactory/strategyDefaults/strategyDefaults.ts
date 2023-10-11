import StrategyDefaultResolvers, { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from ".";
import { getAddress } from "viem";


export async function resolveStrategyDefaults({ client, address, resolver }: StrategyDefaultResolverParams & { resolver?: string }): Promise<StrategyDefault> {
  if (client.chain === undefined) throw new Error(`Chain not initialized`);
  try {
    return resolver ?
      StrategyDefaultResolvers[resolver]({ client, address: getAddress(address) })
      : StrategyDefaultResolvers.default({ client, address: getAddress(address) })
  } catch (e) {
    console.log(`resolveStrategyDefaults-${client.chain?.id}-${address}-${resolver}`, e)
    return ERROR_RESPONSE
  }
}