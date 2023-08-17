import { readContract } from "@wagmi/core";

const LENDING_POOL_ADDRESS = "0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1";

export async function radiant({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        result = await readContract({
            address: LENDING_POOL_ADDRESS,
            abi,
            functionName: "getReservesList",
            chainId,
            args: [],
        }) as string[];
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}

const abi = [
    {
        "inputs": [],
        "name": "getReservesList",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]