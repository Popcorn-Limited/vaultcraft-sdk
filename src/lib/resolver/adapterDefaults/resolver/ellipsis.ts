import { ADDRESS_ZERO, networkMap } from "@/lib/helpers.js";
import { createPublicClient, http } from "viem";

const STAKING_ADDRESS = "0x5B74C99AA2356B4eAa7B85dC486843eDff8Dfdbe";

export async function ellipsis({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<any[]> {
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

    const registeredTokens = await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
        client.readContract({
            address: STAKING_ADDRESS,
            abi: abiStaking,
            functionName: "registeredTokens",
            args: [i],
        })
    )) as string[]

    const assetIdx = registeredTokens.findIndex(item => item.toLowerCase() === address.toLowerCase())

    return [assetIdx !== -1 ? assetIdx : ADDRESS_ZERO];
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