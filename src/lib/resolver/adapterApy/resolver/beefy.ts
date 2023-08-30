import type { Yield } from "src/yieldOptions/types.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";

interface BeefyVault {
  id: string;
  tokenAddress: string;
}

interface ApyBreakdown {
  [key: string]: VaultApy;
}

interface VaultApy {
  totalApy: number;
}

export async function beefy({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {
    const beefyVaults: BeefyVault[] = await (await fetch("https://api.beefy.finance/vaults")).json();
    const apyRes: ApyBreakdown = await (await fetch("https://api.beefy.finance/apy/breakdown")).json();
    const beefyVaultObj = beefyVaults.find(vault => vault.tokenAddress?.toLowerCase() === address.toLowerCase());

    result = beefyVaultObj === undefined ? EMPTY_YIELD_RESPONSE : {
      total: apyRes[beefyVaultObj.id].totalApy * 100,
      apy: [{
        rewardToken: address.toLowerCase(),
        apy: apyRes[beefyVaultObj.id].totalApy * 100
      }]
    }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
};
