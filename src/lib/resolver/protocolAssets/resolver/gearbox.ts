import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

const REGISTER_ADDRESS = "0xA50d4E7D8946a7c90652339CDBd262c375d54D99";

export async function gearbox({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const client = createPublicClient({
            // @ts-ignore
            chain: networkMap[chainId],
            transport: http(rpcUrl)
        })

        const pools = await client.readContract({
            address: REGISTER_ADDRESS,
            abi: abiRegister,
            functionName: "getPools",
        }) as `0x${string}`[]

        result = await Promise.all(pools.map(pool =>
            client.readContract({
                address: pool,
                abi: abiPool,
                functionName: "underlyingToken",
            }),
        )) as string[];
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abiRegister = [
    {
        "inputs": [],
        "name": "getPools",
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
]
const abiPool = [
    {
        "inputs": [],
        "name": "underlyingToken",
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
]
