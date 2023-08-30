import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";

const POOL_ADDRESS = { 1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", 42161: "0x794a61358D6845594F94dc1DB02A252b5b4814aD" };

export async function aaveV3({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        result = await client.readContract({
            // @ts-ignore
            address: POOL_ADDRESS[chainId],
            abi,
            functionName: "getReservesList",
        }) as string[]
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
