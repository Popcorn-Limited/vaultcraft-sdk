import { curveApiCallToBytes } from "@/lib/external/curve/router/call.js";
import { networkMap } from "@/lib/helpers.js";
import { createPublicClient, encodeAbiParameters, http, parseAbiParameters } from "viem";
import type { Address } from "viem";

export async function curveStargateCompounder({ chainId, rpcUrl, address, params }: { chainId: number, rpcUrl: string, address: string, params: any[] }): Promise<string> {
  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const depositAsset = await client.readContract({
    address: address as Address,
    abi: ["function token() view returns (address)"],
    functionName: "token",
  }) as string;

  return await curveApiCallToBytes({
    depositAsset: depositAsset,
    rewardTokens: params[0],
    baseAsset: params[2],
    router: "0x99a58482BD75cbab83b27EC03CA68fF489b5788f",
    // @ts-ignore
    minTradeAmounts: params[1].map(value => BigNumber.from(value)),
    optionalData: encodeAbiParameters(parseAbiParameters("address"), params[3]),
  });
}
