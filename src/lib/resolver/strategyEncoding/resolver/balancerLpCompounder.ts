import { balancerApiProxyCall } from "@/lib/external/balancer/router/call";
import { BatchSwapStep } from "@/lib/external/balancer/router/interfaces";
import { ADDRESS_ZERO, MAX_INT256, MINUS_ONE, networkMap } from "@/lib/helpers";
import { Address, createPublicClient, encodeAbiParameters, http, parseAbiParameters, parseUnits, stringToHex } from "viem";

interface BalancerRoute {
  swaps: BatchSwapStep[];
  assets: string[];
  limits: string[]
}

interface RouteWithTypes {
  route: BalancerRoute;
  swapTypes: string[];
  assetTypes: string[];
  limitTypes: string[];
}

const batchSwapStepType = ["bytes32", "uint256", "uint256", "uint256", "bytes"]

const toAssetRoute = [
  stringToHex('', { size: 32 }), // toAssetRoute.swaps.poolId
  0,  // toAssetRoute.swaps.assetInIndex
  0,  // toAssetRoute.swaps.assetOutIndex
  "0", // toAssetRoute.swaps.amount
  "0x",  // toAssetRoute.swaps.userData
  ADDRESS_ZERO, // toAssetRoute.assets
  "0", // toAssetRoute.limits
]

const BALANCER_VAULT = { 1: "0xBA12222222228d8Ba445958a75a0704d566BF2C8" }

async function createRouteWithTypes(sellToken: string, buyToken: string, chainId: number, rpcUrl: string, gasPrice: string | null | undefined): Promise<RouteWithTypes> {
  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const decimals = await client.readContract({
    address: sellToken as Address,
    abi: ["function decimals() view returns (uint8)"],
    functionName: "decimals",
  }) as BigInt;

  const res = await balancerApiProxyCall({
    sellToken: sellToken,
    buyToken: buyToken,
    orderKind: "sell",
    amount: parseUnits("1", Number(decimals)).toString(),
    gasPrice: gasPrice || parseUnits("1", 9).toString()
  });

  const route: BalancerRoute = {
    swaps: res.swaps.map((swap, i) => {
      return {
        poolId: swap.poolId,
        assetInIndex: swap.assetInIndex,
        assetOutIndex: swap.assetOutIndex,
        amount: i === 0 ? "1" : "0",
        userData: swap.userData
      }
    }),
    assets: res.tokenAddresses,
    limits: res.tokenAddresses.map((address, i) => i < (res.tokenAddresses.length - 1) ? MAX_INT256.toString() : MINUS_ONE.toString())
  }

  return {
    route,
    swapTypes: route.swaps.map(swap => batchSwapStepType).flat(),
    assetTypes: route.assets.map(asset => "address"),
    limitTypes: route.assets.map(asset => "int256")
  }
}

export async function balancerLpCompounder({ chainId, rpcUrl, address, params }: { chainId: number, rpcUrl: string, address: string, params: any[] }): Promise<string> {
  const route1 = await createRouteWithTypes(params[0][0], params[2], chainId, rpcUrl, parseUnits("1", 9).toString()) // TODO - fetch gas price dynamically

  const values = [
    ...route1.route.swaps.map(swap => Object.entries(swap).map(([key, value]) => value)).flat(), // toBaseAssetRoutes1.swaps
    ...route1.route.assets, // toBaseAssetRoutes1.assets
    ...route1.route.limits, // toBaseAssetRoutes1.limits
  ]
  const types = [
    ...route1.swapTypes,
    ...route1.assetTypes,
    ...route1.limitTypes,
  ]

  if (params[0].length == 2) {
    const route2 = await createRouteWithTypes(params[0][0], params[2], chainId, rpcUrl, parseUnits("1", 9).toString()) // TODO - fetch gas price dynamically

    values.push(...route2.route.swaps.map(swap => Object.entries(swap).map(([key, value]) => value)).flat())
    values.push(...route2.route.assets)
    values.push(...route2.route.limits)

    types.push(...route2.swapTypes)
    types.push(...route2.assetTypes)
    types.push(...route2.limitTypes)
  }

  return encodeAbiParameters(
    [
      "address", // baseAsset
      "address", // vault
      ...types,
      ...batchSwapStepType.flat(), // toAssetRoute.swaps
      "address", // toAssetRoute.assets
      "int256",  // toAssetRoute.limits
      ...params[1].map((value: string) => "uint256"), // minTradeAmounts
      "bytes", // optionalData
    ],
    [
      params[2], // baseAsset
      // @ts-ignore
      BALANCER_VAULT[chainId], // vault
      ...values,
      ...toAssetRoute,
      ...params[1], // minTradeAmounts
      encodeAbiParameters(parseAbiParameters("bytes32, uint8"), params[3])  // optionalData
    ]);
}

