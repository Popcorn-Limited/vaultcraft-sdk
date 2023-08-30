import { createPublicClient, http } from "viem";
import type { Address } from "viem";
import { networkMap } from "@/lib/helpers.js";

const BAL = { 1: "0xba100000625a3754423978a60c9317c58a424e3D" }
const AURA = { 1: "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF" }
const BALANCER_VAULT = { 1: "0xBA12222222228d8Ba445958a75a0704d566BF2C8" }

export async function balancerLpCompounder({ chainId, rpcUrl, address, adapter }: { chainId: number, rpcUrl: string, address: string, adapter: string }): Promise<any[]> {
  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const poolId = await client.readContract({
    address: address as Address,
    abi: ["function getPoolId() view returns (bytes32)"],
    functionName: "getPoolId",
  })

  const [tokens, ,] = await client.readContract({
    // @ts-ignore
    address: BALANCER_VAULT[chainId],
    abi: ["function getPoolTokens(bytes32 poolId) view returns (address[] memory tokens,uint256[] memory balances,uint256 lastChangeBlock)"],
    functionName: "getPoolTokens",
    args: [poolId]
  }) as [string[], BigInt[], BigInt]

  // @ts-ignore
  const rewardTokens = [BAL[chainId]];
  const baseAsset = [tokens[0]] // TODO - find a smarter algorithm to determine the base asset
  const minTradeAmounts = ["0"];
  const optionalData = [poolId, 0];

  if (adapter === "AuraAdapter") {
    // @ts-ignore
    rewardTokens.push(AURA[chainId]);
    minTradeAmounts.push("0");
  }

  return [rewardTokens, minTradeAmounts, baseAsset, optionalData]
}
