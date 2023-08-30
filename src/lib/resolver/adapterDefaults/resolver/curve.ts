import { CURVE_ADDRESS } from "@/lib/external/curve";

export async function curve({ chainId, rpcUrl, address }: { chainId: number, rpcUrl: string, address: string }) {
    return [CURVE_ADDRESS[chainId]]
}