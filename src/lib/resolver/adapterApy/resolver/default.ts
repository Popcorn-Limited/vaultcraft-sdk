import { Yield } from "src/yieldOptions/types";
import { EMPTY_YIELD_RESPONSE } from "..";

export async function apyDefault({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  return EMPTY_YIELD_RESPONSE
}