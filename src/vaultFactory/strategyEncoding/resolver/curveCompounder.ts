import { curveApiCallToBytes } from "@/lib/external/curve/router/call.js";
import { StrategyEncodingResolverParams } from "../index.js";
import { MAX_UINT256 } from "@/lib/constants/index.js";
import { Hash } from "viem";

export async function curveCompounder({ client, address, params }: StrategyEncodingResolverParams): Promise<Hash> {
  const data = await curveApiCallToBytes({
    depositAsset: address,
    rewardTokens: params[0],
    baseAsset: params[2],
    router: "0x99a58482BD75cbab83b27EC03CA68fF489b5788f",
    minTradeAmounts: params[1].map((value: string) => "0" ? MAX_UINT256 : BigInt(value)),
    optionalData: "0x",
  });

  return data
}
