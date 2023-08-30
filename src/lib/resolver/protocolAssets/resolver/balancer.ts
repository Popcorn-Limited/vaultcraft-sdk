import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";


const CONTROLLER_ADDRESS = "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

export async function balancer({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
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
            })
        )) as boolean[]

        const aliveGauges = gauges.filter((gauge: any, idx: number) => !areGaugesKilled[idx])

        const lpTokens = await Promise.all(aliveGauges.map((gauge: any) =>
            client.readContract({
                address: gauge,
                abi: abiGauge,
                functionName: "lp_token",
            })
        )) as (string | null)[]

        result = lpTokens.filter(lpToken => !!lpToken) as string[]
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
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