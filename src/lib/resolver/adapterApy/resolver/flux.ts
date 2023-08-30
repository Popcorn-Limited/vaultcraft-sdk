import type { Yield } from "src/yieldOptions/types.js";
import { compoundV2Apy } from "./compoundV2.js";

export async function flux({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  return compoundV2Apy({ address, rpcUrl, chainId, resolver: "flux" })
}
