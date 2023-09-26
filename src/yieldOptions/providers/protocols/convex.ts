import axios from "axios";
import NodeCache from "node-cache";
import type { ChainToAddress, Yield } from "src/yieldOptions/types.js";
import { Address, getAddress } from "viem";
import { IProtocol, getEmptyYield } from "./index.js";
import { CRV } from "./curve.js";

// @dev Make sure the addresses here are correct checksum addresses
const CVX: ChainToAddress = { 1: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B" }

export interface Pool {
    lpToken: Address;
    crvApr: string;
    cvxApr: string;
}

export class Convex implements IProtocol {
    private cache: NodeCache;
    constructor(ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        if (chainId !== 1) {
            throw new Error("Convex is only supported on Ethereum mainnet");
        }
        const pool = (await this.getConvexPools()).find((x) => getAddress(x.lpToken) === asset);
        if (!pool) {
            return getEmptyYield(asset);
        }

        return {
            total: (Number(pool.crvApr) + Number(pool.cvxApr)) * 100,
            apy: [
                {
                    rewardToken: CRV[chainId],
                    apy: Number(pool.crvApr) * 100,
                },
                {
                    rewardToken: CVX[chainId],
                    apy: Number(pool.cvxApr) * 100,
                },
            ],
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) {
            throw new Error("Convex is only supported on Ethereum mainnet");
        }
        const pools = await this.getConvexPools();
        return pools.map((pool) => pool.lpToken);
    }

    private async getConvexPools(): Promise<Pool[]> {
        let pools = this.cache.get("pools") as Pool[];
        if (!pools) {
            const res = await axios.post("https://api.thegraph.com/subgraphs/name/convex-community/convex", {
                headers: {
                    'Content-Type': 'application/json',
                },
                query: `
                {
                    pools {
                    lpToken
                    crvApr
                    cvxApr
                    }
                }
                `,
            });
            pools = res.data.data.pools;
            this.cache.set("pools", pools);
        }
        return pools;
    }
}
