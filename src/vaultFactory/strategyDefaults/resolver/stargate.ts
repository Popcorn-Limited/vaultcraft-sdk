import { Address, getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
      params: [{
        name: "poolId",
        type: "uint256",
    }]
}

const STAKING_ADDRESS: Address = "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b";

export async function stargate({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const poolLength = await client.readContract({
        address: STAKING_ADDRESS,
        abi,
        functionName: "poolLength",
    }) as bigint

    const tokenRes = await client.multicall({
        contracts: Array(Number(poolLength)).fill(undefined).map((item, idx) => {
            return {
                address: STAKING_ADDRESS,
                abi,
                functionName: "poolInfo",
                args: [idx]
            }
        })
    })
    const lpTokens: Address[] = tokenRes.filter(token => token.status === "success").map((token: any) => getAddress(token.result[0]))

    return {
        ...BASE_RESPONSE,
        default: [
            {
                name: "poolId", value:
                    lpTokens.includes(getAddress(address))
                        ? lpTokens.indexOf(getAddress(address))
                        : null
            }
        ]
    }
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
] as const