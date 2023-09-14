import { Address } from "viem";
import { Yield } from "src/yieldOptions/types.js";
import { IProtocol, EMPTY_YIELD_RESPONSE } from "./index.js";
import axios from "axios";

const ADDRESS_TO_SYMBOL = {
    "0xc8c88fdf2802733f8c4cd7c0be0557fdc5d2471c": "ousd", // pop-OUSD
    "0x95ca391fb08f612dc6b0cbddcb6708c21d5a8295": "oeth", // pop-OETH
    "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86": "ousd", // OUSD
    "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3": "oeth", // OETH
    "0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62": "ousd", // wOUSD
    "0xdcee70654261af21c44c093c300ed3bb97b78192": "oeth", // wOETH
};

// @dev dont forget to lowercase the keys when you add a new one
const ORIGIN_TOKENS: Address[] = ["0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3", "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86"]; // oETH, oUSD


export class Origin implements IProtocol {
    async getApy(chainId: number, asset: Address): Promise<Yield> {
        if (chainId !== 1) throw new Error("Origin is only supported on Ethereum mainnet");

        const res = (await axios.get(
            // @ts-ignore
            `https://analytics.ousd.com/api/v2/${ADDRESS_TO_SYMBOL[asset.toLowerCase()]}/apr/trailing/30`
        )).data;
        return {
            total: Number(res.apy),
            apy: [{
                rewardToken: asset,
                apy: Number(res.apy),
            }],
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) throw new Error("Origin is only supported on Ethereum mainnet");

        return ORIGIN_TOKENS;
    }
}