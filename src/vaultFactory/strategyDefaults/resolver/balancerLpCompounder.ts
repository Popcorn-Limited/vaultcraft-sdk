import { balancer } from "./balancer";
import { Address } from "viem";
import { ZERO } from "@/lib/constants";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
  params: [
    {
      name: "gauge",
      type: "address",
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
const BAL: { [key: number]: Address } = { 1: "0xba100000625a3754423978a60c9317c58a424e3D" }
const BALANCER_VAULT: { [key: number]: Address } = { 1: "0xBA12222222228d8Ba445958a75a0704d566BF2C8" }

export async function balancerLpCompounder({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number
  if (Object.keys(BAL).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {
    const poolId = await client.readContract({
      address: address,
      abi: poolAbi,
      functionName: "getPoolId"
    })

    const poolTokens = await client.readContract({
      address: BALANCER_VAULT[chainId],
      abi: balancerVaultAbi,
      functionName: "getPoolTokens",
      args: [poolId]
    })

    const balancerDefaults = await balancer({ client, address })

    return {
      ...BASE_RESPONSE,
      default: [
        { name: "gauge", value: balancerDefaults.default[0].value },
        { name: "rewardTokens", value: [BAL[chainId]] },
        { name: "minTradeAmounts", value: [ZERO] },
        { name: "baseAsset", value: poolTokens[0][0] }, // TODO - find a smarter algorithm to determine the base asset
        { name: "optionalData", value: [poolId, 0] }
      ]
    }
  }
}


const poolAbi = [
  {
    "inputs": [],
    "name": "getPoolId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }] as const

const balancerVaultAbi = [{
  "inputs": [
    {
      "internalType": "bytes32",
      "name": "poolId",
      "type": "bytes32"
    }
  ],
  "name": "getPoolTokens",
  "outputs": [
    {
      "internalType": "contract IERC20[]",
      "name": "tokens",
      "type": "address[]"
    },
    {
      "internalType": "uint256[]",
      "name": "balances",
      "type": "uint256[]"
    },
    {
      "internalType": "uint256",
      "name": "lastChangeBlock",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}] as const