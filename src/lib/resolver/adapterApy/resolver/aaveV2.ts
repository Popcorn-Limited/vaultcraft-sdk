import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";
import { Yield } from "src/yieldOptions/types";
import { EMPTY_YIELD_RESPONSE } from "..";

const LENDING_POOL = { 1: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9" }

export async function aaveV2({ chainId, rpcUrl, address }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {

  let result;
  try {
    const client = createPublicClient({
      // @ts-ignore
      chain: networkMap[chainId],
      transport: http(rpcUrl)
    })

    const reserveData = await client.readContract({
      // @ts-ignore
      address: LENDING_POOL[chainId],
      abi: ["function getReserveData(address asset) view returns (((uint256),uint128,uint128,uint128,uint128,uint128,uint40,address,address,address,address,uint8))"],
      functionName: 'getReserveData',
      args: [address]
    }) as any

    // divided by 1e27 * 100 for percent
    const apy = Number(reserveData[3]) / 1e25;

    result = {
      total: apy,
      apy: [{
        rewardToken: address,
        apy: apy
      }]
    }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
};
