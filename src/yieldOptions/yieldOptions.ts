import NodeCache from "node-cache";
import { Address, getAddress } from "viem";
import type { IProtocolProvider, ProtocolName, Yield, YieldOption } from "./types.js";


// TODO deal with multichain

export class YieldOptions {
    private cache: NodeCache;
    private provider: IProtocolProvider;

    constructor(provider: IProtocolProvider, ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
        this.provider = provider;
    }


    getProtocols(chainId: number): ProtocolName[] {
        return this.provider.getProtocols(chainId);
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const cacheKey = `${chainId}_assets`;
        let allAssets = this.cache.get(cacheKey) as Address[];
        if (!allAssets) {
            allAssets = (await Promise.all(this.getProtocols(chainId).map(async (protocol) => await this.provider.getProtocolAssets(chainId, protocol)))).flat();
            allAssets = allAssets.filter((asset, i, arr) => arr.indexOf(asset) === i);
            this.cache.set(cacheKey, allAssets);
        }

        return allAssets;
    }

    async getProtocolAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        return this.provider.getProtocolAssets(chainId, protocol);
    }

    async getProtocolsByAsset(chainId: number, asset: Address): Promise<ProtocolName[]> {
        const protocols = this.getProtocols(chainId);
        const result: ProtocolName[] = [];
        protocols.forEach(async (protocol) => {
            const assets = await this.provider.getProtocolAssets(1, protocol as ProtocolName);
            if (assets.indexOf(getAddress(asset)) !== -1) {
                result.push(protocol as ProtocolName);
            }
        })
        return result;
    }

    async getYieldOptionsByProtocol(chainId: number, protocol: ProtocolName): Promise<YieldOption[]> {
        const cacheKey = `${chainId}_${protocol}_assets`;
        let result = this.cache.get(cacheKey) as YieldOption[];
        if (!result) {
            const assetList = await this.provider.getProtocolAssets(chainId, protocol);
            result = await Promise.all(assetList.map(async (asset) => {
                return {
                    asset: asset,
                    yield: await this.getApy(chainId, protocol, asset),
                };
            }));
            this.cache.set(cacheKey, result);
        }
        return result;
    }

    async getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        const cacheKey = `${chainId}_${protocol}_${asset}`;
        let apy = this.cache.get(cacheKey) as Yield;
        if (!apy) {
            apy = await this.provider.getApy(chainId, protocol, asset);
            this.cache.set(cacheKey, apy);
        }
        return apy;
    }
}

