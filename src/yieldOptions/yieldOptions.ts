import NodeCache from "node-cache";
import { Address } from "viem";
import { IProtocolProvider } from "./providers/protocolProvider.js";
import type { ProtocolName, Yield, YieldOption } from "./types.js";


// TODO how to differentiate between adapter and protocol? --> make it all strategies (Vaults V2 design)
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
            allAssets = (await Promise.all(this.getProtocols(chainId).map(async (protocol) => await this.provider.getAssets(chainId, protocol)))).flat();
            allAssets = allAssets.filter((asset, i, arr) => arr.indexOf(asset) === i);
            this.cache.set(cacheKey, allAssets);
        }

        return allAssets;
    }

    async getProtocolsByAsset(chainId: number, asset: Address): Promise<ProtocolName[]> {
        const protocols = this.getProtocols(chainId);
        const result: ProtocolName[] = [];
        for (let protocol in protocols) {
            const assets = await this.provider.getAssets(1, protocol as ProtocolName);
            if (assets.indexOf(asset) !== -1) {
                result.push(protocol as ProtocolName);
            }
        }
        return result;
    }

    async getYieldOptionsByProtocol(chainId: number, protocol: ProtocolName): Promise<YieldOption[]> {
        const cacheKey = `${chainId}_${protocol}_assets`;
        let result = this.cache.get(cacheKey) as YieldOption[];
        if (!result) {
            const assetList = await this.provider.getAssets(chainId, protocol);
            result = await Promise.all(assetList.map(async (asset) => {
                return {
                    address: asset,
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

