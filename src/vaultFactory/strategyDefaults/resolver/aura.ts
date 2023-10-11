import { StrategyDefault, StrategyDefaultResolverParams } from "..";
import getAuraPools from "@/lib/external/aura/getAuraPools";

const BASE_RESPONSE = {
      params: [{
        name: "poolId",
        type: "uint256",
    }]
}

export async function aura({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const chainId = client.chain?.id as number
    const pools = await getAuraPools(chainId)
    const pool = pools.filter(pool => !pool.isShutdown).find(pool => pool.lpToken.address.toLowerCase() === address.toLowerCase())
    return {
        ...BASE_RESPONSE,
        default: [
            { name: "poolId", value: pool !== undefined ? pool.id : null }
        ]
    }
}