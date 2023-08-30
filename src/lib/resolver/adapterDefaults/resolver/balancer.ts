import { ADDRESS_ZERO, networkMap } from "@/lib/helpers.js";
import { createPublicClient, http } from "viem";

const CONTROLLER_ADDRESS = "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

export async function balancer({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<any[]> {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    const n_gauges = await client.readContract({
        address: CONTROLLER_ADDRESS,
        abi: abiController,
        functionName: "n_gauges",
    }) as BigInt

    const gauges = await Promise.all(Array(Number(n_gauges)).fill(undefined).map((_, i) =>
        client.readContract({
            address: CONTROLLER_ADDRESS,
            abi: abiController,
            functionName: "gauges",
            args: [i]
        })
    )) as string[]

    const areGaugesKilled = await Promise.all(gauges.map((gauge: any) =>
        client.readContract({
            address: gauge,
            abi: abiGauge,
            functionName: "is_killed",
            args: []
        })
    )) as boolean[]

    const aliveGauges = gauges.filter((gauge: any, i: number) => !areGaugesKilled[i])

    const lpTokens = await Promise.all(aliveGauges.map((gauge: any) =>
        client.readContract({
            address: gauge,
            abi: abiGauge,
            functionName: "lp_token",
            args: [],
        })
    )) as (string | null)[]

    const tokenIdx = lpTokens.findIndex(lpToken => lpToken?.toLowerCase() === address.toLowerCase())

    return [
        tokenIdx !== -1 ? aliveGauges[tokenIdx] : ADDRESS_ZERO,
    ]
}

const abiController = [
    {
        "stateMutability": "view",
        "type": "function",
        "name": "n_gauges",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "int128"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "gauges",
        "inputs": [
            {
                "name": "arg0",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
]
const abiGauge = [
    {
        "stateMutability": "view",
        "type": "function",
        "name": "lp_token",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "stateMutability": "view",
        "type": "function",
        "name": "is_killed",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ]
    },
]