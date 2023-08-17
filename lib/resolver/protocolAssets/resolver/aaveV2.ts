import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const POOL_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";

export async function aaveV2({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        result = await client.readContract({
            address: POOL_ADDRESS,
            abi,
            functionName: "getReservesList",
        }) as string[];
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abi = [
    {
        "inputs": [],
        "name": "getReservesList",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
]