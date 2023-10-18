import { Address, getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
    params: [{
        name: "poolId",
        type: "uint256",
    }]
}

const REGISTER_ADDRESS: Address = "0xA50d4E7D8946a7c90652339CDBd262c375d54D99";

export async function gearbox({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const pools = await client.readContract({
        address: REGISTER_ADDRESS,
        abi: abiRegister,
        functionName: "getPools"
    })

    const tokenRes = await client.multicall({
        contracts: pools.map(pool => ({
            address: pool,
            abi: abiPool,
            functionName: "underlyingToken",
        })),
    })
    const tokens: Address[] = tokenRes.filter(token => token.status === "success").map((token: any) => token.result)

    const assetIdx = tokens.findIndex(token => getAddress(token) === getAddress(address));

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "poolId", value: assetIdx === -1 ? null : assetIdx }
        ]
    }
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
] as const;
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
] as const;
