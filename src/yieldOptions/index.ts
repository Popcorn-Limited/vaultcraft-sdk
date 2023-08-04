import { resolveProtocolAssets } from "@/lib/resolver/protocolAssets/protocolAssets.js";
import type { Adapter, Chain, YieldData } from "./types.d.ts"
import adapters from "@/lib/constants/adapters.json";

export default class YieldOptions {
  private yieldData: YieldData;


  constructor() {
    this.yieldData = {};
  }

  async setupNetwork(chainId: number): Promise<void> {
    this.yieldData[chainId] = {} as Chain;

    const adaptersByChain = (adapters as Adapter[]).filter(adapter => adapter.chains.includes(chainId));

    // Filter unique protocols
    const protocols: string[] = adaptersByChain.map(adapter => adapter.protocol).filter((protocol, i) => protocols.indexOf(protocol) === i)

    this.yieldData[chainId].protocols = protocols;
    protocols.forEach(protocol => this.yieldData[chainId][protocol] = []);

    // Resolve assets for each adapter
    const res = await Promise.all(adaptersByChain.map(adapter => resolveProtocolAssets({ chainId: chainId, resolver: adapter.resolver })))
    this.yieldData[chainId].assetAddresses = res.flat().map(address => address.toLowerCase());

    const yieldRes = await Promise.all(this.yieldData[chainId].assetAddresses.map(asset => resolveAdapterApy({ chainId: chainId, address: asset, resolver: p.key })))


    // TODO we should loop through each protocol to get the assets than yield per asset and than store that together
    // TODO how do we seperate adapter and protocols? is there any difference?
  }

}