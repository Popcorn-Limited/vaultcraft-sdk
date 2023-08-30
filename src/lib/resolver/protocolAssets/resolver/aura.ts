import getAuraPools from "@/lib/external/aura/getAuraPools";

export async function aura({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const pools = await getAuraPools(chainId)

        result = pools.filter(pool => !pool.isShutdown).map(pool => pool.lpToken.address)
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}