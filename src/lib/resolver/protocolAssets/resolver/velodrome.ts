import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";

const PAIR_FACTORY_ADDRESS = "0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746";

export async function velodrome({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        const allPairLength = await client.readContract({
            address: PAIR_FACTORY_ADDRESS,
            abi: abiFactory,
            functionName: "allPairsLength",
        }) as BigInt

        result = await Promise.all(Array(Number(allPairLength)).fill(undefined).map((_, i) =>
            client.readContract({
                address: PAIR_FACTORY_ADDRESS,
                abi: abiFactory,
                functionName: "allPairs",
                args: [i]
            })
        )) as string[];
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abiFactory = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allPairs",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "allPairsLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
]
