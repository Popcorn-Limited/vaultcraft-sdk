import { localhost, mainnet } from "wagmi/chains";
import AdapterDefaultResolvers from "./index.js";

export async function resolveAdapterDefaults({ chainId, rpcUrl, address, resolver }: { chainId: number, rpcUrl: string, address: string, resolver?: string }): Promise<any[]> {
  if (chainId === localhost.id) chainId = mainnet.id;
  return resolver ? AdapterDefaultResolvers[resolver]({ chainId, rpcUrl, address }) : AdapterDefaultResolvers.default({ chainId, rpcUrl, address })
}