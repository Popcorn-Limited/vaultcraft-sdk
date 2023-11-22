import type { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { Address, PublicClient, getAddress } from "viem";
import { IProtocol } from "./index.js";


const SOMMELIER_ASSETS: Address[] = [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH
]

export class Sommelier implements IProtocol {
  private client: PublicClient;
  constructor(client: PublicClient) {
    this.client = client;
  }

  key(): ProtocolName {
    return "sommelier";
  }

  async getApy(chainId: number, asset: Address): Promise<Yield> {
    if (chainId !== 1) throw new Error("Sommelier is only available on Ethereum mainnet");

    return {
      total: 0,
      apy: [{
        rewardToken: getAddress(asset),
        apy: 0
      }]
    };
  }

  getAssets(chainId: number): Promise<Address[]> {
    if (chainId !== 1) throw new Error("Sommelier is only available on Ethereum mainnet");

    return Promise.resolve(SOMMELIER_ASSETS.map(asset => getAddress(asset)))
  }
}