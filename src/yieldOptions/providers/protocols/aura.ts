import axios from "axios";
import NodeCache from "node-cache";
import { Yield } from "src/yieldOptions/types.js";
import { Address } from "viem";
import { EMPTY_YIELD_RESPONSE, IProtocol } from "./index.js";


export class Aura implements IProtocol {
    private cache: NodeCache;

    constructor(ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
    }
    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const pools = await this.getPools(chainId);
        if (!pools) return EMPTY_YIELD_RESPONSE;

        const pool = pools.find(pool => pool.lpToken.address.toLowerCase() === asset.toLowerCase());

        return pool === undefined ?
            EMPTY_YIELD_RESPONSE :
            {
                total: pool.aprs.total,
                apy: pool.aprs.breakdown.map(b => {
                    return {
                        // If there is no token its fees in the lpToken
                        rewardToken: b.token ? b.token.address.toLowerCase() : asset.toLowerCase(),
                        apy: b.value
                    };
                })
            };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const pools = await this.getPools(chainId);
        if (!pools) return [];

        return pools.filter(pool => !pool.isShutdown).map(pool => pool.lpToken.address) as Address[];
    }

    private async getPools(chainId: number): Promise<AuraPool[] | undefined> {
        let pools = this.cache.get("pools") as AuraPool[];
        if (!pools) {
            pools = await getAuraPools(chainId);
            this.cache.set("pools", pools);
        }
        return pools;
    }
}

interface AuraPool {
    id: string;
    isShutdown: boolean;
    aprs: {
        total: number;
        breakdown: {
            id: string;
            token: {
                symbol: string;
                name: string;
                address: string;
            };
            name: string;
            value: number;
        }[];
    };
    lpToken: {
        address: string;
    };
}

async function getAuraPools(chainId: number): Promise<AuraPool[]> {
    const res = await axios.post('https://data.aura.finance/graphql', {
        headers: {
            'Content-Type': 'application/json',
        },
        query: `
        query Pools($chainId: Int = 1) {
          pools(chainId: $chainId){
            id
            lpToken
            {
              address
            }
            aprs {
              total
              breakdown {
                id
                token{
                  symbol
                  name
                  address
                }
              name
              value
              }
            }
          }
        }
      `,
        variables: {
            chainId: chainId,
        },
    });
    return res.data.data.pools;
}