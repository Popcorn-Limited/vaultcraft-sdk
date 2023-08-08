import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const POOL_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";

export async function aaveV2({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }) {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    return await client.readContract({
        address: POOL_ADDRESS,
        abi,
        functionName: "getReservesList",
    }) as string[];
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