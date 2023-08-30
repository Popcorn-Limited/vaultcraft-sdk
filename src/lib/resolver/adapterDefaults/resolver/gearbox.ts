import { ADDRESS_ZERO, networkMap } from "@/lib/helpers.js";
import { createPublicClient, http } from "viem";

const REGISTER_ADDRESS = "0xA50d4E7D8946a7c90652339CDBd262c375d54D99";

export async function gearbox({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }) {
    const client = createPublicClient({
        // @ts-ignore
        chain: networkMap[chainId],
        transport: http(rpcUrl)
    })

    const pools = await client.readContract({
        address: REGISTER_ADDRESS,
        abi: abiRegister,
        functionName: "getPools",
        args: [],
    }) as `0x${string}`[]

    const tokens = await Promise.all(pools.map(pool =>
        client.readContract({
            address: pool,
            abi: abiPool,
            functionName: "underlyingToken",
        }),
    )) as string[];

    const assetIdx = tokens.findIndex(token => token.toLowerCase() === address.toLowerCase());

    return [assetIdx !== -1 ? assetIdx : ADDRESS_ZERO];
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
