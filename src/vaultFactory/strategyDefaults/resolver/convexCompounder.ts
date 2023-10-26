import { Address } from "viem";
import { convex } from "./convex.js";
import { ZERO } from "@/lib/constants/index.js";
import { ERROR_RESPONSE, LOCAL_NETWORKS, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

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

// @dev Make sure the addresses here are correct checksum addresses
const CRV: { [key: number]: Address } = { 1: "0xD533a949740bb3306d119CC777fa900bA034cd52" }
const CVX: { [key: number]: Address } = { 1: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B" }

export async function convexCompounder({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = LOCAL_NETWORKS.includes(client.chain?.id as number) ? 1 : client.chain?.id as number;
  if (Object.keys(CRV).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {
    const convexDefaults = await convex({ client, address })
    return {
      ...BASE_RESPONSE,
      default: [
        { name: "poolId", value: convexDefaults.default[0].value },
        { name: "rewardTokens", value: [CRV[chainId], CVX[chainId]] },
        { name: "minTradeAmounts", value: [ZERO, ZERO] },
        { name: "baseAsset", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, // USDC
        { name: "optionalData", value: ["0x"] }
      ]
    }
  }
}
