import { Address, PublicClient, zeroAddress } from "viem";
import { Yield } from "src/yieldOptions/index.js";

export interface IProtocol {
    getAssets(chainId: number): Promise<Address[]>;
    getApy(chainId: number, asset: Address): Promise<Yield>;
}

export type Clients = {
    [chainId: number]: PublicClient;
};

export function getEmptyYield(asset: Address): Yield {
    return {
        total: 0,
        apy: [{
            rewardToken: asset,
            apy: 0,
        }]
    };
}

export { AaveV2 } from "./aavev2.js";
export { AaveV3 } from "./aavev3.js";
export { Aura } from "./aura.js";
export { Beefy } from "./beefy.js";
export { CompoundV2 } from "./compoundv2.js";
export { Curve } from "./curve.js";
export { Idle } from "./idle.js";
export { Origin } from "./origin.js";
export { Yearn } from "./yearn.js";