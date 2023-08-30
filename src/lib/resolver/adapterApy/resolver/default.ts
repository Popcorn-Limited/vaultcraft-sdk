import type { Yield } from "src/yieldOptions/types.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";

export async function apyDefault({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  return EMPTY_YIELD_RESPONSE
}