import { readContract } from "@wagmi/core";
import { readContracts } from "wagmi"
import { convexBoosterAbi, CONVEX_BOOSTER_ADDRESS } from "@/lib/external/convex";


export default async function getConvexPools({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[][]> {
  const poolLength = await readContract({
    // @ts-ignore
    address: CONVEX_BOOSTER_ADDRESS[chainId],
    abi: convexBoosterAbi,
    chainId,
    functionName: "poolLength",
    args: []
  }) as BigInt

  const poolInfos = await readContracts({
    contracts: Array(poolLength.toNumber()).fill(undefined).map((item, idx) => {
      return {
        // @ts-ignore
        address: CONVEX_BOOSTER_ADDRESS[chainId],
        abi: convexBoosterAbi,
        functionName: "poolInfo",
        chainId,
        args: [idx]
      }
    })
  }) as string[][]

  return poolInfos
}