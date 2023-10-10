import { getConvexPools } from "@/lib/external/convex";
import { getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
    key: "",
    params: [{
        name: "poolId",
        type: "uint256",
    }]
}

export async function convex({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const pools = await getConvexPools({ chainId, client });
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