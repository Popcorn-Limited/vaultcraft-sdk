import getAuraPools from "@/lib/external/aura/getAuraPools";

export async function aura({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<any[]> {
    const pools = await getAuraPools(chainId)
    const pool = pools.filter(pool => !pool.isShutdown).find(pool => pool.lpToken.address.toLowerCase() === address.toLowerCase())
    return [pool === undefined ? 0 : pool.id]
}