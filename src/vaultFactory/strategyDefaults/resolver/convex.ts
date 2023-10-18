import { getConvexPools } from "@/lib/external/convex/index.js";
import { getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
      params: [{
        name: "poolId",
        type: "uint256",
    }]
}

export async function convex({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const pools = await getConvexPools();
    const poolId = pools.map(item => getAddress(item.lpToken)).indexOf(address)
    return {
        ...BASE_RESPONSE,
        default: [
            {
                name: "poolId", value: poolId === -1 ? null : poolId
            }
        ]
    }
}