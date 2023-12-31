import StrategyEncodingResolvers, { StrategyEncodingResolverParams } from "./index.js";
import { Hash, getAddress } from "viem";

export async function resolveStrategyEncoding({ client, address, params, resolver }: StrategyEncodingResolverParams & { resolver?: string }): Promise<Hash> {
  if (!client.chain) throw new Error(`Chain not initialized`);
  try {
    return resolver
      ? StrategyEncodingResolvers[resolver]({ client, address: getAddress(address), params })
      : StrategyEncodingResolvers.default({ client, address: getAddress(address), params })
  } catch (e) {
    console.log(`resolveStrategyEncoding-${client.chain?.id}-${address}-${resolver}`, e)
    return "0x"
  }
}