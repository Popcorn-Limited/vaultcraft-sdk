import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers.js";

const COMPOUND_PROXY_CONTRACT = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

export async function compoundV2({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        let cTokens = await client.readContract({
            address: COMPOUND_PROXY_CONTRACT,
            abi: abiProxy,
            functionName: "getAllMarkets",
        }) as `0x${string}`[]

        // Filter out cETH since it doesnt have underlying
        cTokens = cTokens.filter(item => item !== "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5")

        result = await Promise.all(
            cTokens.map(item =>
                client.readContract({
                    address: item,
                    abi: abiMarket,
                    functionName: "underlying",
                })
            )) as string[]
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abiProxy = [
    {
        "constant": true,
        "inputs": [],
        "name": "getAllMarkets",
        "outputs": [
            {
                "internalType": "contract CToken[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
]
const abiMarket = [
    {
        "constant": true,
        "inputs": [],
        "name": "underlying",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
]