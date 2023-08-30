import { ADDRESS_ZERO } from "@/lib/helpers";
import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const STAKING_ADDRESS = "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b";

export async function stargate({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }) {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    const poolLength = await client.readContract({
        address: STAKING_ADDRESS,
        abi,
        functionName: "poolLength",
        args: []
    }) as BigInt

    const tokens = await Promise.all(Array(Number(poolLength)).fill(undefined).map((_, i) =>
        client.readContract({
            address: STAKING_ADDRESS,
            abi,
            functionName: "poolInfo",
            args: [i]
        })
    )) as Array<{
        lpToken: string,
    }>

    const lpTokens = tokens.map(item => item.lpToken.toLowerCase())

    return [
        lpTokens.includes(address.toLowerCase())
            ? lpTokens.indexOf(address.toLowerCase())
            : ADDRESS_ZERO
    ]
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