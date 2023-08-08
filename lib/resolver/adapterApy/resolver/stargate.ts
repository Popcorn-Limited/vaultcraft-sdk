import { networkNames } from "@/lib/helpers";
import { Address, createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

export interface Pool {
  chain: string;
  project: string;
  underlyingTokens: string[];
  apy: number;
}

export async function stargate({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
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
  return pool === undefined ? 0 : pool.apy
}
