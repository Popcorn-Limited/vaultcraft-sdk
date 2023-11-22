import axios from "axios";
import NodeCache from "node-cache";
import { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { Address, getAddress } from "viem";
import { getEmptyYield, IProtocol } from "./index.js";
import getAuraPools, { AuraPool } from "@/lib/external/aura/getAuraPools.js";


export class Aura implements IProtocol {
    private cache: NodeCache;

    constructor(ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
    }

    key(): ProtocolName {
        return "aura";
    }
    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const pools = await this.getPools(chainId);

        const pool = pools.find(pool => getAddress(pool.lpToken.address) === getAddress(asset));
        if (!pool) {
            return getEmptyYield(asset);
        }
        const result: Yield = {
            total: 0,
            apy: [],
        };

        pool.aprs.breakdown.forEach((apr) => {
            if (!apr.value || apr.value <= 0) {
                // we don't care about rewards with 0 yield
                return;
            }

            result.total += apr.value;
            result.apy!.push({
                rewardToken: getAddress(apr.token?.address || asset),
                apy: apr.value,
            });
        });
        return result;
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const pools = await this.getPools(chainId);
        if (!pools) return [];

        return pools.filter(pool => !pool.isShutdown).map(pool => getAddress(pool.lpToken.address)) as Address[];
    }

    private async getPools(chainId: number): Promise<AuraPool[]> {
        let pools = this.cache.get("pools") as AuraPool[];
        if (!pools) {
            pools = await getAuraPools(chainId);
            this.cache.set("pools", pools);
        }
        return pools;
    }
}