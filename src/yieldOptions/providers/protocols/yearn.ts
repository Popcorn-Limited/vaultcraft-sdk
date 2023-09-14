import { Yield } from "src/yieldOptions/types.js";
import { Clients, EMPTY_YIELD_RESPONSE, IProtocol } from "./index.js";
import { Address } from "viem";
import { ChainId } from "@/lib/helpers.js";
import NodeCache from "node-cache";
import axios from "axios";

const VAULT_REGISTRY_ADDRESS = { 1: "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804", 42161: "0x3199437193625DCcD6F9C9e98BDf93582200Eb1f" };
const VAULT_FACTORY_ADDRESS = "0x21b1FC8A52f179757bf555346130bF27c0C2A17A";

type Vault = {
    token: {
        address: Address;
    },
    apy: {
        net_apy: number;
    };
}

export class Yearn implements IProtocol {
    private cache: NodeCache;
    private clients: Clients;
    constructor(clients: Clients, ttl: number) {
        this.clients = clients;
        this.cache = new NodeCache({ stdTTL: ttl });
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        let vaults = this.cache.get("vaults") as Vault[];
        if (!vaults) {
            vaults = (await axios.get(`https://api.yearn.fi/v1/chains/${chainId}/vaults/all`)).data;
            this.cache.set("vaults", vaults);
        }
        const vault = vaults.find((vault: any) => vault.token.address.toLowerCase() === asset.toLowerCase());

            return vault === undefined ?
                EMPTY_YIELD_RESPONSE :
                {
                    total: vault.apy.net_apy * 100,
                    apy: [{
                        rewardToken: asset.toLowerCase(),
                        apy: vault.apy.net_apy * 100
                    }]
                };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`missing public client for chain ID: ${chainId}`);
        let assets = this.cache.get("assets") as Address[];
        if (assets) {
            return assets;
        }
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
        assets = [...registryTokens, ...factoryTokens].filter((item, idx, arr) => arr.indexOf(item) === idx);
        this.cache.set("assets", assets);
        return assets;
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