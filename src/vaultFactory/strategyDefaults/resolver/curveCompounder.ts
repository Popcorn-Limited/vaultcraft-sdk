import { Address } from "viem";
import { curve } from "./curve";
import { ZERO } from "@/lib/constants";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
  key: "",
  params: [
    {
      name: "rewardTokens",
      type: "uint256[]",
    },
    {
      name: "minTradeAmounts",
      type: "uint256[]",
    },
    {
      name: "baseAsset",
      type: "address",
    },
    {
      name: "optionalData",
      type: "bytes",
    }
  ]
}

// @dev Make sure the addresses here are correct checksum addresses
const CRV: { [key: number]: Address } = { 1: "0xD533a949740bb3306d119CC777fa900bA034cd52" }

export async function curveCompounder({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  if (Object.keys(CRV).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {
    return {
      ...BASE_RESPONSE,
      default: [
        { name: "rewardTokens", value: [CRV[chainId]] },
        { name: "minTradeAmounts", value: [ZERO] },
        { name: "baseAsset", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, // USDC
        { name: "optionalData", value: ["0x"] }
      ]
    }
  }
}
