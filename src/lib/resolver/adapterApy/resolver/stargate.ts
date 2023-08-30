import { networkNames } from "@/lib/helpers";
import { Address, createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";
import { EMPTY_YIELD_RESPONSE } from "..";
import { Yield } from "src/yieldOptions/types";

export interface Pool {
  chain: string;
  project: string;
  underlyingTokens: string[];
  apy: number;
  rewardTokens: string[];
}

export async function stargate({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {
    const client = createPublicClient({
      // @ts-ignore
      chain: networkMap[chainId],
      transport: http(rpcUrl)
    })

    const token = await client.readContract({
      // @ts-ignore
      address: address,
      abi: ["function token() external view returns (address)"],
      functionName: 'token'
    }) as Address
    const pools = await (await fetch("https://yields.llama.fi/pools")).json();

    // @ts-ignore
    const filteredPools: Pool[] = pools.data.filter((pool: Pool) => pool.chain === networkNames[chainId] && pool.project === "stargate")
    const pool = filteredPools.find(pool => pool.underlyingTokens[0].toLowerCase() === token.toLowerCase())

    result = pool === undefined ? EMPTY_YIELD_RESPONSE :
      {
        total: pool.apy,
        apy: [{
          rewardToken: pool.rewardTokens[0].toLowerCase(),
          apy: pool.apy
        }]
      }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
}
