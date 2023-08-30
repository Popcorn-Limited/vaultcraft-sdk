import { localhost, mainnet } from "wagmi/chains";
import StrategyEncodingResolvers from ".";

export async function resolveStrategyEncoding({ chainId, rpcUrl, address, params, resolver }: { chainId: number, rpcUrl: string, address: string, params: any[], resolver?: string }): Promise<string> {
  if (chainId === localhost.id) chainId = mainnet.id;
  return resolver ? StrategyEncodingResolvers[resolver]({ chainId, rpcUrl, address, params }) : StrategyEncodingResolvers.default({ chainId, rpcUrl, address, params })
}