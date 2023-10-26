
import { Address } from "viem";
import { aura } from "./aura.js";
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
const BAL: { [key: number]: Address } = { 1: "0xba100000625a3754423978a60c9317c58a424e3D" }
const AURA: { [key: number]: Address } = { 1: "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF" }
const BALANCER_VAULT: { [key: number]: Address } = { 1: "0xBA12222222228d8Ba445958a75a0704d566BF2C8" }

export async function auraCompounder({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = LOCAL_NETWORKS.includes(client.chain?.id as number) ? 1 : client.chain?.id as number;
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

    const auraDefaults = await aura({ client, address })

    return {
      ...BASE_RESPONSE,
      default: [
        { name: "poolId", value: auraDefaults.default[0].value },
        { name: "rewardTokens", value: [BAL[chainId], AURA[chainId]] },
        { name: "minTradeAmounts", value: [ZERO, ZERO] },
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