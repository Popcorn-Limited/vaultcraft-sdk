import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const LENDING_POOL = { 1: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9" }

export async function aaveV2({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
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
  return Number(reserveData[3]) / 1e25;
};
