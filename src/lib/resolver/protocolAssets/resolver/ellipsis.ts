import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";

const STAKING_ADDRESS = "0x5B74C99AA2356B4eAa7B85dC486843eDff8Dfdbe";

export async function ellipsis({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        const poolLength = await client.readContract({
            address: STAKING_ADDRESS,
            abi: abiStaking,
            functionName: "poolLength",
        }) as BigInt;

        result = await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
            client.readContract({
                address: STAKING_ADDRESS,
                abi: abiStaking,
                functionName: "registeredTokens",
                args: [i],
            })
        )) as string[]
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abiStaking = [
    {
        "inputs": [],
        "name": "poolLength",
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
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "registeredTokens",
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
]