import { readContract } from "@wagmi/core";
import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const CONVEX_BOOSTER_ADDRESS = { 1: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31", 42161: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31" }

export async function convex({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }) {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    const poolLength = await readContract({
        // @ts-ignore
        address: CONVEX_BOOSTER_ADDRESS[chainId],
        abi,
        functionName: "poolLength",
        chainId,
        args: []
    }) as BigInt

    const poolInfo = await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
        client.readContract({
            // @ts-ignore
            address: CONVEX_BOOSTER_ADDRESS[chainId],
            abi,
            functionName: "poolInfo",
            args: [i]
        })
    )) as { lptoken: string, gauge: string, rewards: string, factory: string, shutdown: boolean }[]

    return poolInfo.map(item => item.lptoken);
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
                "internalType": "address",
                "name": "lptoken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "gauge",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "rewards",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "factory",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "shutdown",
                "type": "bool"
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