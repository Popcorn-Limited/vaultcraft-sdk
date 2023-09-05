import { Yield } from "src/yieldOptions/types.js";
import { Clients, EMPTY_YIELD_RESPONSE, IProtocol } from "./index.js";
import { Address } from "viem";
import { ChainId } from "@/lib/helpers.js";

const VAULT_REGISTRY_ADDRESS = { 1: "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804", 42161: "0x3199437193625DCcD6F9C9e98BDf93582200Eb1f" };
const VAULT_FACTORY_ADDRESS = "0x21b1FC8A52f179757bf555346130bF27c0C2A17A";

export class Yearn implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        try {
            const res = await (await fetch(`https://api.yearn.fi/v1/chains/${chainId}/vaults/all`)).json();
            const vault = res.find((vault: any) => vault.token.address.toLowerCase() === asset.toLowerCase());

            return vault === undefined ?
                EMPTY_YIELD_RESPONSE :
                {
                    total: vault.apy.net_apy * 100,
                    apy: [{
                        rewardToken: asset.toLowerCase(),
                        apy: vault.apy.net_apy * 100
                    }]
                };
        } catch (e) {
            console.error(e);
            return EMPTY_YIELD_RESPONSE;
        }
    }

    async getAssets(chainId: number): Promise<Address[]> {
        try {
            const client = this.clients[chainId];
            if (!client) throw new Error(`missing public client for chain ID: ${chainId}`);

            const numTokens = await client.readContract({
                // @ts-ignore
                address: VAULT_REGISTRY_ADDRESS[chainId],
                abi: abiRegistry,
                functionName: "numTokens",
            }) as BigInt;

            const registryTokens = await Promise.all(Array(Number(numTokens)).fill(undefined).map((_, i) =>
                client.readContract({
                    // @ts-ignore
                    address: VAULT_REGISTRY_ADDRESS[chainId],
                    abi: abiRegistry,
                    functionName: "tokens",
                    args: [BigInt(i)]
                })
            ));

            let factoryTokens: Address[] = [];
            if (chainId === ChainId.Ethereum) {
                const allDeployedVaults = await client.readContract({
                    address: VAULT_FACTORY_ADDRESS,
                    abi: abiFactory,
                    functionName: "allDeployedVaults",
                });

                factoryTokens = await Promise.all(allDeployedVaults.map(item =>
                    client.readContract({
                        address: item,
                        abi: abiVault,
                        functionName: "token",
                    })
                ));
            }

            return [...registryTokens, ...factoryTokens].filter((item, idx, arr) => arr.indexOf(item) === idx);
        } catch (e) {
            console.error(e);
            return [];
        }
    }
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
] as const;
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
] as const;
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
] as const;