import axios from "axios";
import NodeCache from "node-cache";
import { Address } from "viem";
import { Yield } from "src/yieldOptions/types.js";
import { CURVE_ADDRESS } from "@/lib/external/curve/index.js";
import { IProtocol, EMPTY_YIELD_RESPONSE } from "./index.js";

const NETWORK_NAMES = { 1: "ethereum", 1337: "ethereum", 10: "optimism", 137: "polygon", 250: "fantom", 42161: "arbitrum" };

type PoolData = {
    lpTokenAddress: Address;
    gaugeAddress: Address;
    gaugeCrvApy: number[];
};

export class Curve implements IProtocol {
    private cache: NodeCache;
    constructor(ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const poolData = await this.getPoolData(chainId);
        if (!poolData) return EMPTY_YIELD_RESPONSE;

        const pool = poolData.find(pool => pool.lpTokenAddress?.toLowerCase() === asset.toLowerCase());
        if (!pool) return EMPTY_YIELD_RESPONSE;
        // TODO: there are quite a number of pools that have `null` or no gauge reward data at all.
        // This covers all such cases. It sets the apy to 0 for all of them. Ideally we'd filter those out
        const apy = pool.gaugeCrvApy?.length > 0 ? pool.gaugeCrvApy[0] || 0 : 0;
        return {
            total: apy,
            apy: [{
                rewardToken: CURVE_ADDRESS[chainId],
                apy: apy,
            }]
        };

    }

    async getAssets(chainId: number): Promise<Address[]> {
        const poolData = await this.getPoolData(chainId);
        if (!poolData) return [];

        return poolData.filter(pool => pool.gaugeAddress).map(pool => pool.lpTokenAddress);
    };

    private async getPoolData(chainId: number): Promise<PoolData[] | undefined> {
        // @ts-ignore
        const network = NETWORK_NAMES[chainId];
        if (!network) throw new Error(`chain %{chainId} not supported`);

        // if one hour has passed since we last called the Curve API, we'll refresh the cache data.
        let poolData = this.cache.get(`poolData_${network}`) as PoolData[];
        if (!poolData) {
            try {
                const main = axios.get(`https://api.curve.fi/api/getPools/${network}/main`);
                const crypto = axios.get(`https://api.curve.fi/api/getPools/${network}/crypto`);
                const factory = axios.get(`https://api.curve.fi/api/getPools/${network}/factory`);
                const factoryCrypto = axios.get(`https://api.curve.fi/api/getPools/${network}/factory-crypto`);
                const factoryCrvusd = axios.get(`https://api.curve.fi/api/getPools/${network}/factory-crvusd`);
                const factoryTtricrypto = axios.get(`https://api.curve.fi/api/getPools/${network}/factory-tricrypto`);

                const responses = await Promise.all([main, crypto, factory, factoryCrypto, factoryCrvusd, factoryTtricrypto]);
                const pools = responses.map((resp) => resp.data);
                poolData = pools.map((pool) => pool.data.poolData).flat();
                this.cache.set(`poolData_${network}`, poolData);
            } catch (e) {
                console.log(e);
            }
        }
        return poolData;
    }
}