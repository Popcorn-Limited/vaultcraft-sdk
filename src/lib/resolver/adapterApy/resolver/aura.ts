import getAuraPools from "@/lib/external/aura/getAuraPools.js";
import type { Yield } from "src/yieldOptions/types.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";

export async function aura({ chainId, rpcUrl, address }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {

    const pools = await getAuraPools(chainId)
    const pool = pools.find(pool => pool.lpToken.address.toLowerCase() === address.toLowerCase())
    pool === undefined ? 0 : pool.aprs.total

    result = pool === undefined ?
      EMPTY_YIELD_RESPONSE :
      {
        total: pool.aprs.total,
        apy: pool.aprs.breakdown.map(b => {
          return {
            // If there is no token its fees in the lpToken
            rewardToken: b.token ? b.token.address.toLowerCase() : address.toLowerCase(),
            apy: b.value
          }
        })
      }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
}