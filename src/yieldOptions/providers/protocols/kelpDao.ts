import type { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { Address, getAddress } from "viem";
import { IProtocol, getEmptyYield } from "./index.js";
import axios from "axios";


const KELP_ASSETS: { [key: number]: Address[] } = {
  1: [
    "0xBCe0Cf87F513102F22232436CCa2ca49e815C3aC", // Ethx
    "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7", // rsETH
  ],
}

export class KelpDao implements IProtocol {
  constructor() { }

  key(): ProtocolName {
    return "kelpDao";
  }

  async getApy(chainId: number, asset: Address): Promise<Yield> {
    if (chainId !== 1) throw new Error("KelpDao is only available on Ethereum mainnet");

    const apy = (await axios.get(`https://universe.kelpdao.xyz/rseth/apy`)).data.value

    return apy ? {
      total: apy,
      apy: [{
        rewardToken: getAddress(asset),
        apy: apy
      }]
    } : getEmptyYield(asset);
  }

  getAssets(chainId: number): Promise<Address[]> {
    if (chainId !== 1) throw new Error("KelpDao is only available on Ethereum mainnet");

    return Promise.resolve(KELP_ASSETS[chainId].map(asset => getAddress(asset)))
  }
}