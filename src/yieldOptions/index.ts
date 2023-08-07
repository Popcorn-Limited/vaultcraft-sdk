import { resolveProtocolAssets } from "@/lib/resolver/protocolAssets/protocolAssets.js";
import type { Adapter, Asset, Chain, RpcUrls, YieldData } from "./types.d.ts"
import adapters from "@/lib/constants/adapters.json";
import { resolveAdapterApy } from "@/lib/resolver/adapterApy/adapterApy.js";


async function fetchAssetsByAdapter({ chainId, rpcUrl, adapter }: { chainId: number, rpcUrl: string, adapter: Adapter }) {
  const assetAddresses = (await resolveProtocolAssets({ chainId, rpcUrl, resolver: adapter.resolver })).flat().map(address => address.toLowerCase());
  const assets = await Promise.all(assetAddresses.map(async address => {
    return {
      address: address,
      yield: {
        total: await resolveAdapterApy({ chainId, rpcUrl, address, resolver: adapter.resolver })
      }
    }
  }))
  return { assetAddresses, assets };
}

// TODO how to differentiate between adapter and protocol?
// TODO switch ethers for viem
// TODO resolver should fail gracefully and return undefined or similar

export default class YieldOptions {
  private yieldData: YieldData;
  private rpcUrls: RpcUrls;
  private chainIds: number[];

  constructor(_rpcUrls: RpcUrls) {
    this.yieldData = {};
    this.rpcUrls = _rpcUrls;
    this.chainIds = Object.keys(_rpcUrls).map(chainId => Number(chainId));
  }

  async setupNetwork(chainId: number): Promise<void> {
    if (!this.chainIds.includes(chainId)) return // TODO should throw error

    this.yieldData[chainId] = {} as Chain;

    const adaptersByChain = (adapters as Adapter[]).filter(adapter => adapter.chains.includes(chainId));

    // Filter unique protocols
    const protocols: string[] = adaptersByChain.map(adapter => adapter.protocol).filter((protocol, i) => protocols.indexOf(protocol) === i)

    this.yieldData[chainId].protocols = protocols;

    // Resolve assets for each adapter
    const res = await Promise.all(adaptersByChain.map(adapter => fetchAssetsByAdapter({ chainId: chainId, rpcUrl: this.rpcUrls[chainId], adapter: adapter })))
    this.yieldData[chainId].assetAddresses = res.map(p => p.assetAddresses).flat()
    res.forEach((p, i) => this.yieldData[chainId].assetsByProtocol[adaptersByChain[i].protocol].push(...p.assets))
    res.forEach((p, i) => p.assetAddresses.forEach(a => this.yieldData[chainId].protocolsByAsset[a].push(adaptersByChain[i].protocol)))
  }

  getProtocols(chainId: number): string[] {
    return this.yieldData[chainId].protocols;
  }

  getAssetAdresses(chainId: number): string[] {
    return this.yieldData[chainId].assetAddresses;
  }

  getAssetsByProtocol(chainId: number, protocol: string): Asset[] {
    return this.yieldData[chainId].assetsByProtocol[protocol];
  }

  getProtocolsByAsset(chainId: number, asset: string): string[] {
    return this.yieldData[chainId].protocolsByAsset[asset];
  }

  getApy(chainId: number, protocol: string, asset: string): number | undefined {
    const assetData = this.yieldData[chainId].assetsByProtocol[protocol].find(a => a.address === asset);
    return assetData === undefined ? undefined : assetData.yield.total;
  }
}