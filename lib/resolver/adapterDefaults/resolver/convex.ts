import { getConvexPools } from "@/lib/external/convex";

export async function convex({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string; }): Promise<any[]> {
    const pools = await getConvexPools({ chainId, rpcUrl });

    return [pools.map(item => item[0].toLowerCase()).indexOf(address.toLowerCase())];
}