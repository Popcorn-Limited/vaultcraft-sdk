import { Address, getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
    params: [{
        name: "gauge",
        type: "address",
    }]
}

const CONTROLLER_ADDRESS: Address = "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

export async function balancer({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const n_gauges = await client.readContract({
        address: CONTROLLER_ADDRESS,
        abi: abiController,
        functionName: "n_gauges"
    })

    const gaugesRes = await client.multicall({
        contracts: Array(Number(n_gauges)).fill(undefined).map((item, idx) => {
            return {
                address: CONTROLLER_ADDRESS,
                abi: abiController,
                functionName: "gauges",
                args: [idx]
            }
        })
    })
    const gauges: Address[] = gaugesRes.filter(gauge => gauge.status === "success").map((gauge: any) => getAddress(gauge.result))

    const areGaugesKilledRes = await client.multicall({
        contracts: gauges.map((gauge: Address) => {
            return {
                address: gauge,
                abi: abiGauge,
                functionName: "is_killed",
            }
        })
    })
    const areGaugesKilled: boolean[] = areGaugesKilledRes.filter(entry => entry.status === "success").map((entry: any) => entry.result)
    const aliveGauges = gauges.filter((gauge: Address, idx: number) => !areGaugesKilled[idx])

    const lpTokensRes = await client.multicall({
        contracts: aliveGauges.map((gauge: Address) => {
            return {
                address: gauge,
                abi: abiGauge,
                functionName: "lp_token"
            }
        })
    })
    const lpTokens: Address[] = lpTokensRes.filter(token => token.status === "success").map((token: any) => token.result)

    const tokenIdx = lpTokens.findIndex(lpToken => getAddress(lpToken) === getAddress(address))

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "gauge", value: tokenIdx !== -1 ? aliveGauges[tokenIdx] : null },
        ]
    }
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
] as const
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
] as const