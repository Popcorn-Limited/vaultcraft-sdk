import { Contract, ethers } from "ethers";
import { networkMap } from "@/lib/connectors";


// TODO - find a more robist way to calculating this apy

export async function convex({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
  const curvePool = new Contract(
    address,
    ["function coins(uint256) view returns (address)"],
    new ethers.providers.JsonRpcProvider(rpcUrl, chainId),
  )

  const underlyings: string[] = [];
  for (let i = 0; i < 4; i++) {
    try {
      const underlying = await curvePool.coins(i);
      underlyings.push(underlying);
    } catch (e) {
      // exit the loop if there are no more coins
      break;
    }
  }

  const pools = await (await fetch("https://yields.llama.fi/pools")).json();

  // @ts-ignore
  const filteredPools: Pool[] = pools.data.filter((pool: Pool) => pool.chain === networkMap[chainId] && pool.project === "convex-finance")
  const pool = filteredPools.find(pool => pool.underlyingTokens.toString().toLowerCase() === underlyings.toString().toLowerCase())
  return pool === undefined ? Infinity : pool.apy
}