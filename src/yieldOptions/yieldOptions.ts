import NodeCache from "node-cache";
import { Address, getAddress } from "viem";
import type { IProtocolProvider, Protocol, ProtocolName, Yield, YieldOption } from "./types.js";

export class YieldOptions {
    private cache: NodeCache;
    private provider: IProtocolProvider;

    constructor({ provider, ttl }: { provider: IProtocolProvider, ttl: number }) {
        this.cache = new NodeCache({ stdTTL: ttl });
        this.provider = provider;
    }

    getProtocols(chainId: number): Protocol[] {
        return this.provider.getProtocols(chainId);
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const cacheKey = `${chainId}_assets`;
        let allAssets = this.cache.get(cacheKey) as Address[];
        if (!allAssets) {
            allAssets = (await Promise.all(this.getProtocols(chainId).map(async (protocol) => await this.provider.getProtocolAssets({ chainId, protocol: protocol.key })))).flat();
            allAssets = allAssets.filter((asset, i, arr) => arr.indexOf(asset) === i);
            this.cache.set(cacheKey, allAssets);
        }
        return allAssets;
    }

    async getProtocolAssets({ chainId, protocol }: { chainId: number, protocol: ProtocolName }): Promise<Address[]> {
        return this.provider.getProtocolAssets({ chainId, protocol });
    }

    async getProtocolsByAsset({ chainId, asset }: { chainId: number, asset: Address }): Promise<Protocol[]> {
        const protocols = this.getProtocols(chainId);
        const result: Protocol[] = [];
        protocols.forEach(async (protocol) => {
            const assets = await this.provider.getProtocolAssets({ chainId, protocol: protocol.key as ProtocolName });
            if (assets.indexOf(getAddress(asset)) !== -1) {
                result.push(protocol);
            }
        })
        return result;
    }

    async getYieldOptionsByProtocol({ chainId, protocol }: { chainId: number, protocol: ProtocolName }): Promise<YieldOption[]> {
        const cacheKey = `${chainId}_${protocol}_assets`;
        let result = this.cache.get(cacheKey) as YieldOption[];
        if (!result) {
            const assetList = await this.provider.getProtocolAssets({ chainId, protocol });
            result = await Promise.all(assetList.map(async (asset) => {
                return {
                    asset: asset,
                    yield: await this.getApy({ chainId, protocol, asset }),
                };
            }));
            this.cache.set(cacheKey, result);
        }
        return result;
    }

    async getApy({ chainId, protocol, asset }: { chainId: number, protocol: ProtocolName, asset: Address }): Promise<Yield> {
        const cacheKey = `${chainId}_${protocol}_${asset}`;
        let apy = this.cache.get(cacheKey) as Yield;
        if (!apy) {
            apy = await this.provider.getApy({ chainId, protocol, asset });
            this.cache.set(cacheKey, apy);
        }
        return apy;
    }
}

