import { resolveProtocolAssets } from "@/lib/resolver/protocolAssets/protocolAssets.js";
import type { Adapter, Asset, Chain, RpcUrls, YieldData } from "./types.js";
import adapters from "@/lib/constants/adapters.js";
import { resolveAdapterApy } from "@/lib/resolver/adapterApy/adapterApy.js";


async function fetchAssetsByAdapter({ chainId, rpcUrl, adapter }: { chainId: number, rpcUrl: string, adapter: Adapter }):
  Promise<{ assetAddresses: string[], assets: Asset[] }> {

  // Get all assets supported by this protocol
  const assetAddresses = (await resolveProtocolAssets({ chainId, rpcUrl, resolver: adapter.resolver })).flat().map(address => address.toLowerCase());

  // Add yield data to each asset
  const assets = await Promise.all(assetAddresses.map(async address => {
    return {
      address: address,
      yield: await resolveAdapterApy({ chainId, rpcUrl, address, resolver: adapter.resolver })
    }
  }))
  return { assetAddresses, assets };
}

// TODO how to differentiate between adapter and protocol? --> make it all strategies (Vaults V2 design)
// TODO deal with multichain

export class YieldOptions {
  private yieldData: YieldData;
  private rpcUrls: RpcUrls;
  private chainIds: number[];

  constructor(_rpcUrls: RpcUrls) {
    this.yieldData = {};
    this.rpcUrls = _rpcUrls;
    this.chainIds = Object.keys(_rpcUrls).map(chainId => Number(chainId));
  }

  async setupNetwork(chainId: number): Promise<boolean> {
    if (!this.chainIds.includes(chainId)) throw new Error("Network not supported")

    // setup empty objects for later key access
    this.yieldData[chainId] = {} as Chain;
    this.yieldData[chainId].assetsByProtocol = {}
    this.yieldData[chainId].protocolsByAsset = {}

    let adaptersByChain = (adapters as Adapter[]).filter(adapter => adapter.chains.includes(chainId));

    let protocols: string[] = adaptersByChain.map(adapter => adapter.protocol)
    // Filter unique protocols
    protocols.filter((protocol, i) => protocols.indexOf(protocol) === i)

    // Save all protocol keys
    this.yieldData[chainId].protocols = protocols;

    // Resolve assets for each adapter
    const res = await Promise.all(adaptersByChain.map(adapter => fetchAssetsByAdapter({ chainId: chainId, rpcUrl: this.rpcUrls[chainId], adapter: adapter })))

    // Add all supported asset addresses
    this.yieldData[chainId].assetAddresses = res.map(p => p.assetAddresses).flat()

    // Add all supported assets per protocol
    res.forEach((p, i) => {
      const key = adaptersByChain[i].protocol
      if (this.yieldData[chainId].assetsByProtocol[key] === undefined) {
        this.yieldData[chainId].assetsByProtocol[key] = []
      }
      this.yieldData[chainId].assetsByProtocol[key].push(...p.assets)
    })

    // Loop over each asset and append protocols keys for each protocol that supports the asset
    res.forEach((p, i) =>
      p.assetAddresses.forEach(a => {
        if (this.yieldData[chainId].protocolsByAsset[a] === undefined) {
          this.yieldData[chainId].protocolsByAsset[a] = []
        }
        this.yieldData[chainId].protocolsByAsset[a].push(adaptersByChain[i].protocol)
      }))

    return true;
  }

  getProtocols(chainId: number): string[] {
    if (!this.yieldData[chainId]) throw new Error("Network needs to be setup first")
    return this.yieldData[chainId].protocols;
  }

  getAssetAdresses(chainId: number): string[] {
    if (!this.yieldData[chainId]) throw new Error("Network needs to be setup first")
    return this.yieldData[chainId].assetAddresses;
  }

  getAssetsByProtocol(chainId: number, protocol: string): Asset[] {
    if (!this.yieldData[chainId]) throw new Error("Network needs to be setup first")
    return this.yieldData[chainId].assetsByProtocol[protocol];
  }

  getProtocolsByAsset(chainId: number, asset: string): string[] {
    if (!this.yieldData[chainId]) throw new Error("Network needs to be setup first")
    return this.yieldData[chainId].protocolsByAsset[asset];
  }

  getApy(chainId: number, protocol: string, asset: string): number | undefined {
    if (!this.yieldData[chainId]) throw new Error("Network needs to be setup first")
    const assetData = this.yieldData[chainId].assetsByProtocol[protocol].find(a => a.address === asset);
    return assetData === undefined ? undefined : assetData.yield.total;
  }
}

export type * from "./types.js";
