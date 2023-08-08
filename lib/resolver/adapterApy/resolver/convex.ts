import { networkNames } from "@/lib/helpers";
import { Address, createPublicClient, http } from "viem";
import { Pool } from "./stargate";
import { networkMap } from "@/lib/helpers";


// TODO - find a more robist way to calculating this apy

export async function convex({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
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
  return pool === undefined ? Infinity : pool.apy
}