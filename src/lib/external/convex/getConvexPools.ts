import { convexBoosterAbi, CONVEX_BOOSTER_ADDRESS } from "./constants.js";
import { createPublicClient, http } from "viem";


export default async function getConvexPools({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[][]> {
  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const poolLength = await client.readContract({
    // @ts-ignore
    address: CONVEX_BOOSTER_ADDRESS[chainId],
    abi: convexBoosterAbi,
    functionName: "poolLength",
  }) as BigInt

  return await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
    client.readContract({
      // @ts-ignore
      address: CONVEX_BOOSTER_ADDRESS[chainId],
      abi: convexBoosterAbi,
      functionName: "poolInfo",
      args: [i]
    })
  )) as string[][]
}