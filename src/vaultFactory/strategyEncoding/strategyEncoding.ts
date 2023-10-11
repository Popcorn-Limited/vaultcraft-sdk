import { localhost, mainnet } from "wagmi/chains";
import StrategyEncodingResolvers, { StrategyEncodingResolverParams } from ".";
import { Hash, getAddress } from "viem";

export async function resolveStrategyEncoding({ client, address, params, resolver }: StrategyEncodingResolverParams & { resolver?: string }): Promise<Hash> {
  if (client.chain === undefined) throw new Error(`Chain not initialized`);
  try {
    return resolver
      ? StrategyEncodingResolvers[resolver]({ client, address: getAddress(address), params })
      : StrategyEncodingResolvers.default({ client, address: getAddress(address), params })
  } catch (e) {
    console.log(`resolveStrategyEncoding-${client.chain?.id}-${address}-${resolver}`, e)
    return "0x"
  }
}