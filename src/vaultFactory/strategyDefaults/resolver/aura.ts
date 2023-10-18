import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";
import getAuraPools from "@/lib/external/aura/getAuraPools.js";
import { getAddress } from "viem";

const BASE_RESPONSE = {
    params: [{
        name: "poolId",
        type: "uint256",
    }]
}

export async function aura({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const chainId = client.chain?.id as number
    const pools = await getAuraPools(chainId)
    const pool = pools.filter(pool => !pool.isShutdown).find(pool => getAddress(pool.lpToken.address) === getAddress(address))
    return {
        ...BASE_RESPONSE,
        default: [
            { name: "poolId", value: pool !== undefined ? pool.id : null }
        ]
    }
}