import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";

const STARGATE_ADDRESS = { 1: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b", 42161: "0xeA8DfEE1898a7e0a59f7527F076106d7e44c2176" }

export async function stargate({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        const poolLength = await client.readContract({
            // @ts-ignore
            address: STARGATE_ADDRESS[chainId],
            abi,
            functionName: "poolLength",
        }) as BigInt

        const tokens = await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
            client.readContract({
                // @ts-ignore
                address: STARGATE_ADDRESS[chainId],
                abi,
                functionName: "poolInfo",
                args: [i]
            })
        )) as string[][]

        result = tokens.map(item => item?.[0]).filter(item => Boolean(item)) ?? []
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "poolInfo",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "lpToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allocPoint",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastRewardBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "accStargatePerShare",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
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
]