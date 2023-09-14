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

    // getProtocolsByAsset(chainId: number, asset: Address): ProtocolName[] {
    //     if (chainId !== 1) {
    //         throw new Error("only supported on mainnet");
    //     }
    //     // protocol[0] == protocol name, e.g. "aaveV2"
    //     // protocol[1] == list of asset addresses
    //     // we filter out all the ones that don't contain the asset we're looking for and
    //     // create a new array containing the protocol names of the ones that have the asset.
    //     return Object.entries(assets[1])
    //         .filter((protocol) => protocol[1].indexOf(asset) !== -1)
    //         .map((protocol) => protocol[0]) as ProtocolName[];
    // }

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
