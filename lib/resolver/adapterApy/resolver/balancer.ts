import getAuraPools from "@/lib/external/aura/getAuraPools"
import { ADDRESS_ZERO } from "@/lib/helpers"
import { Yield } from "src/yieldOptions/types"
import { EMPTY_YIELD_RESPONSE } from ".."

export async function balancer({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {
    const pools = await getAuraPools(chainId)
    const pool = pools.find(pool => pool.lpToken.address.toLowerCase() === address.toLowerCase())

    if (pool === undefined) return EMPTY_YIELD_RESPONSE

    const balApy = pool.aprs.breakdown.find(breakdown => breakdown.name === 'BAL')
    const feeApy = pool.aprs.breakdown.find(breakdown => breakdown.name === 'Swap fees')
    const totalApy = (balApy?.value || 0) + (feeApy?.value || 0)

    result = {
      total: totalApy,
      apy: [
        {
          rewardToken: balApy?.token?.address.toLowerCase() || ADDRESS_ZERO,
          apy: balApy?.value || 0
        },
        {
          rewardToken: address.toLowerCase(),
          apy: feeApy?.value || 0
        }
      ]
    }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
}