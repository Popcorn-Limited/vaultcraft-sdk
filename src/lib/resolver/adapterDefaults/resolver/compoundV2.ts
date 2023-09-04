import { ADDRESS_ZERO, networkMap } from "@/lib/helpers.js";
import { createPublicClient, http } from "viem";

const COMPTROLLER_ADDRESS = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

export async function compoundV2({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }) {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    let cTokens = await client.readContract({
        address: COMPTROLLER_ADDRESS,
        abi: abiComptroller,
        functionName: "getAllMarkets",
        args: []
    }) as `0x${string}`[];

    // Filter out cETH since it doesnt have underlying
    cTokens = cTokens.filter(item => item !== "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5")

    let underlying = await Promise.all(cTokens.map(item =>
        client.readContract({
            address: item,
            abi: abiMarket,
            functionName: "underlying",
        })
    )) as string[]
    underlying = underlying.map(item => item?.toLowerCase())

    return [
        underlying.includes(address.toLowerCase())
            ? cTokens[underlying.indexOf(address.toLowerCase())]
            : ADDRESS_ZERO
    ]
}

const abiComptroller = [
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
    }
]