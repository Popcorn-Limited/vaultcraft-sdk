import { Address } from "viem";
import { stargate } from "./stargate.js";
import { ZERO } from "@/lib/constants/index.js";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
  params: [
    {
      name: "poolId",
      type: "uint256",
    },
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

export async function curveStargateCompounder({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number

  if (Object.keys(STARGATE_ROUTER).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {
    const stargateDefaults = await stargate({ client, address })
    return {
      ...BASE_RESPONSE,
      default: [
        { name: "poolId", value: stargateDefaults.default[0].value },
        { name: "rewardTokens", value: [STG_ADDRESS[chainId]] },
        { name: "minTradeAmounts", value: [ZERO] },
        { name: "baseAsset", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, // USDC
        { name: "optionalData", value: [STARGATE_ROUTER[chainId]] }
      ]
    }
  }
}
