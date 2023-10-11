import { Address, getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
      params: [{
        name: "cToken",
        type: "address",
    }]
}

const COMPTROLLER_ADDRESS: Address = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

export async function compoundV2({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const cTokens = await client.readContract({
        address: COMPTROLLER_ADDRESS,
        abi: abiComptroller,
        functionName: "getAllMarkets",
    })

    const underlyingRes = await client.multicall({
        contracts: cTokens.map(address => {
            return {
                address,
                abi: abiMarket,
                functionName: "underlying",
            }
        })
    })
    const underlying: Address[] = underlyingRes.filter(token => token.status === "success").map((token: any) => getAddress(token.result))

    return {
        ...BASE_RESPONSE,
        default: [
            {
                name: "cToken", value:
                    underlying.includes(getAddress(address))
                        ? getAddress(cTokens[underlying.indexOf(getAddress(address))])
                        : null
            }
        ]
    }
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
] as const;
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
] as const;