import { networkNames } from "@/lib/helpers.js";
import { createPublicClient, http } from "viem";
import type { Address } from "viem";
import type { Pool } from "./stargate.js";
import { networkMap } from "@/lib/helpers.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";
import type { Yield } from "src/yieldOptions/types.js";


// TODO - find a more robist way to calculating this apy

export async function convex({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {
    const client = createPublicClient({
      // @ts-ignore
      chain: networkMap[chainId],
      transport: http(rpcUrl)
    })

    const underlyings: string[] = [];
    for (let i = 0; i < 4; i++) {
      try {
        const underlying = await client.readContract({
          // @ts-ignore
          address: cTokenAddress,
          abi: ['function coins(uint256) view returns (address)'],
          functionName: 'coins',
          args: [i]
        }) as Address
        underlyings.push(underlying);
      } catch (e) {
        // exit the loop if there are no more coins
        break;
      }
    }

    const pools = await (await fetch("https://yields.llama.fi/pools")).json();

    // @ts-ignore
    const filteredPools: Pool[] = pools.data.filter((pool: Pool) => pool.chain === networkNames[chainId] && pool.project === "convex-finance")
    const pool = filteredPools.find(pool => pool.underlyingTokens.toString().toLowerCase() === underlyings.toString().toLowerCase())
    result = EMPTY_YIELD_RESPONSE
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
}