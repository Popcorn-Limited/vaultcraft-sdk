import { Address } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
      params: [{
        name: "poolId",
        type: "uint256",
    }]
}

const STAKING_ADDRESS: Address = "0x5B74C99AA2356B4eAa7B85dC486843eDff8Dfdbe";

export async function ellipsis({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const poolLength = await client.readContract({
        address: STAKING_ADDRESS,
        abi: abiStaking,
        functionName: "poolLength"
    })

    const registeredTokensRes = await client.multicall({
        contracts: Array(Number(poolLength)).fill(undefined).map((item, idx) => {
            return {
                address: STAKING_ADDRESS,
                abi: abiStaking,
                functionName: "registeredTokens",
                args: [idx]
            }
        })
    })
    const registeredTokens: Address[] = registeredTokensRes.filter(token => token.status === "success").map((token: any) => token.result)

    const assetIdx = registeredTokens.findIndex(item => item.toLowerCase() === address.toLowerCase())

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "poolId", value: assetIdx !== -1 ? assetIdx : null }
        ]
    }
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
] as const