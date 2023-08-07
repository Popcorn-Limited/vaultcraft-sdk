import getAuraPools from "@/lib/external/aura/getAuraPools";

export async function aura({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<any[]> {
    const pools = await getAuraPools(chainId)

    return pools.filter(pool => !pool.isShutdown).map(pool => pool.lpToken.address)
}