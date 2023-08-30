import { resolveAdapterDefaults } from "@/lib/resolver/adapterDefaults/adapterDefaults.js";
import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";
import type { Yield } from "src/yieldOptions/types.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";

export async function compoundV2Apy({ chainId, rpcUrl, address, resolver }: { chainId: number, rpcUrl: string, address: string, resolver: string }): Promise<Yield> {
  let result;
  try {
    const [cTokenAddress] = await resolveAdapterDefaults({ chainId, rpcUrl, address, resolver })

    const client = createPublicClient({
      // @ts-ignore
      chain: networkMap[chainId],
      transport: http(rpcUrl)
    })

    const supplyRate = await client.readContract({
      // @ts-ignore
      address: cTokenAddress,
      abi: ['function supplyRatePerBlock() public view returns (uint)'],
      functionName: 'supplyRatePerBlock'
    }) as BigInt

    const apy = (((Math.pow((Number(supplyRate) / 1e18 * 7200) + 1, 365))) - 1) * 100

    result = {
      total: apy,
      apy: [{
        rewardToken: address.toLowerCase(),
        apy: apy
      }]
    }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
}

export async function compoundV2({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  return compoundV2Apy({ chainId, rpcUrl, address, resolver: "compoundV2" })
}
