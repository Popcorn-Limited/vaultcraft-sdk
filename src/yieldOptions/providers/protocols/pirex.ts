import type { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { Address, PublicClient, getAddress } from "viem";
import { IProtocol } from "./index.js";


const PIREX_ASSETS: Address[] = [
  "0xBCe0Cf87F513102F22232436CCa2ca49e815C3aC" // pxCVX
]

export class Pirex implements IProtocol {
  private client: PublicClient;
  constructor(client: PublicClient) {
    this.client = client;
  }

  key(): ProtocolName {
    return "pirex";
  }

  async getApy(chainId: number, asset: Address): Promise<Yield> {
    if (chainId !== 1) throw new Error("Pirex is only available on Ethereum mainnet");

    return {
      total: 0,
      apy: [{
        rewardToken: getAddress(asset),
        apy: 0
      }]
    };
  }

  getAssets(chainId: number): Promise<Address[]> {
    if (chainId !== 1) throw new Error("Pirex is only available on Ethereum mainnet");

    return Promise.resolve(PIREX_ASSETS.map(asset => getAddress(asset)))
  }
}