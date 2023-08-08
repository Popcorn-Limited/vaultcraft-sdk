import { localhost, mainnet } from "wagmi/chains";
import StrategyDefaultResolvers from ".";

export async function resolveStrategyDefaults({ chainId, rpcUrl, address, adapter, resolver }: { chainId: number, rpcUrl: string, address: string, adapter: string, resolver?: string }): Promise<any[]> {
  if (chainId === localhost.id) chainId = mainnet.id;
  return resolver ? StrategyDefaultResolvers[resolver]({ chainId, rpcUrl, address, adapter }) : StrategyDefaultResolvers.default({ chainId, rpcUrl, address, adapter })
}