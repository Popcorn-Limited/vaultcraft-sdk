import { localhost, mainnet } from "wagmi/chains";
import AdapterApyResolvers from ".";

export async function resolveAdapterApy({ chainId, rpcUrl, address, resolver }: { chainId: number, rpcUrl: string, address: string, resolver?: string }): Promise<number> {
  if (chainId === localhost.id) chainId = mainnet.id;
  return resolver ? AdapterApyResolvers[resolver]({ chainId, rpcUrl, address }) : AdapterApyResolvers.default({ chainId, rpcUrl, address })
}