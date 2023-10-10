import { Address } from "viem";
import { stargate } from "./stargate";
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

const STG_ADDRESS: { [key: number]: Address } = { 1: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6" }
const STARGATE_ROUTER: { [key: number]: Address } = { 1: "0x8731d54E9D02c286767d56ac03e8037C07e01e98" }

export async function curveStargateCompounder({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  if (Object.keys(STARGATE_ROUTER).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {
    return {
      ...BASE_RESPONSE,
      default: [
        { name: "rewardTokens", value: [STG_ADDRESS[chainId]] },
        { name: "minTradeAmounts", value: [ZERO] },
        { name: "baseAsset", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, // USDC
        { name: "optionalData", value: [STARGATE_ROUTER[chainId]] }
      ]
    }
  }
}