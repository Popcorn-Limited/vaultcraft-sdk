import { LOCAL_NETWORKS, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";
import getAuraPools from "@/lib/external/aura/getAuraPools.js";
import { getAddress } from "viem";

const BASE_RESPONSE = {
    params: [{
        name: "poolId",
        type: "uint256",
    }]
}

export async function aura({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const chainId = LOCAL_NETWORKS.includes(client.chain?.id as number) ? 1 : client.chain?.id as number;
    const pools = await getAuraPools(chainId)
    const pool = pools.filter(pool => !pool.isShutdown).find(pool => getAddress(pool.lpToken.address) === getAddress(address))
    console.log(pool)
    return {
        ...BASE_RESPONSE,
        default: [
            { name: "poolId", value: pool !== undefined ? pool.id : null }
        ]
    }
}