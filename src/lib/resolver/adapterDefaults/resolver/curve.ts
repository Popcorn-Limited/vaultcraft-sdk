import { CURVE_ADDRESS } from "@/lib/external/curve/index.js";

export async function curve({ chainId, rpcUrl, address }: { chainId: number, rpcUrl: string, address: string }) {
    return [CURVE_ADDRESS[chainId]]
}