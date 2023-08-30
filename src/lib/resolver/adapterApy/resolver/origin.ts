import type { Yield } from "src/yieldOptions/types.js";
import { EMPTY_YIELD_RESPONSE } from "../index.js";

const ADDRESS_TO_SYMBOL = {
  "0xc8c88fdf2802733f8c4cd7c0be0557fdc5d2471c": "ousd", // pop-OUSD
  "0x95ca391fb08f612dc6b0cbddcb6708c21d5a8295": "oeth", // pop-OETH
  "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86": "ousd", // OUSD
  "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3": "oeth", // OETH
  "0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62": "ousd", // wOUSD
  "0xdcee70654261af21c44c093c300ed3bb97b78192": "oeth", // wOETH
}

export async function origin({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {

  let result;
  try {
    const res = await (await fetch(
      // @ts-ignore
      `https://analytics.ousd.com/api/v2/${ADDRESS_TO_SYMBOL[address.toLowerCase()]}/apr/trailing/30`
    )).json();
    result = {
      total: Number(res.apy),
      apy: [{
        rewardToken: address.toLowerCase(),
        apy: Number(res.apy)
      }]
    }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result
};
