import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const LENDING_POOL = { 1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" }

export async function aaveV3({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const reserveData = await client.readContract({
    // @ts-ignore
    address: LENDING_POOL[chainId],
    abi: ["function getReserveData(address asset) view returns (((uint256),uint128,uint128,uint128,uint128,uint128,uint40,uint16,address,address,address,address,uint128,uint128,uint128))"],
    functionName: 'getReserveData',
    args: [address]
  }) as any

  return Number(reserveData[2]) / 1e25;
};
