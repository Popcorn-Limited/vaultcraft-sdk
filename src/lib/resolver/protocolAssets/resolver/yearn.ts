import { createPublicClient, http } from "viem";
import { mainnet } from "wagmi/chains";
import { networkMap } from "@/lib/helpers.js";

const VAULT_REGISTRY_ADDRESS = { 1: "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804", 42161: "0x3199437193625DCcD6F9C9e98BDf93582200Eb1f" };
const VAULT_FACTORY_ADDRESS = "0x21b1FC8A52f179757bf555346130bF27c0C2A17A";

export async function yearn({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        const numTokens = await client.readContract({
            // @ts-ignore
            address: VAULT_REGISTRY_ADDRESS[chainId],
            abi: abiRegistry,
            functionName: "numTokens",
        }) as BigInt

        const registryTokens = await Promise.all(Array(Number(numTokens)).fill(undefined).map((_, i) =>
            client.readContract({
                // @ts-ignore
                address: VAULT_REGISTRY_ADDRESS[chainId],
                abi: abiRegistry,
                functionName: "tokens",
                args: [i]
            })
        )) as string[]

        let factoryTokens: string[] = []
        if (chainId === mainnet.id) {
            const allDeployedVaults = await client.readContract({
                address: VAULT_FACTORY_ADDRESS,
                abi: abiFactory,
                functionName: "allDeployedVaults",
            }) as `0x${string}`[]

            factoryTokens = await Promise.all(allDeployedVaults.map(item =>
                client.readContract({
                    address: item,
                    abi: abiVault,
                    functionName: "token",
                })
            )) as string[]
        }

        result = [...registryTokens, ...factoryTokens].filter((item, idx, arr) => arr.indexOf(item) === idx)
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}



const abiRegistry = [
    {
        "stateMutability": "view",
        "type": "function",
        "name": "tokens",
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
    {
        "stateMutability": "view",
        "type": "function",
        "name": "numTokens",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ]
    },
];
const abiFactory = [
    {
        "inputs": [],
        "name": "allDeployedVaults",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
];
const abiVault = [
    {
        "stateMutability": "view",
        "type": "function",
        "name": "token",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ]
    },
];