import { localhost, mainnet } from "wagmi/chains";
import StrategyDefaultResolvers, { EMPTY_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from ".";
import { getAddress } from "viem";


export async function resolveStrategyDefaults({ chainId, client, address, resolver }: StrategyDefaultResolverParams & { resolver?: string }): Promise<StrategyDefault> {
  if (chainId === localhost.id) chainId = mainnet.id;

  try {
    return resolver ?
      StrategyDefaultResolvers[resolver]({ chainId, client, address: getAddress(address) })
      : StrategyDefaultResolvers.default({ chainId, client, address: getAddress(address) })
  } catch (e) {
    console.log(`resolveStrategyDefaults-${chainId}-${address}-${resolver}`, e)
    return EMPTY_RESPONSE
  }
}