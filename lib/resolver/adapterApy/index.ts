
import { Yield } from "src/yieldOptions/types";
import {
  aaveV2,
  aaveV3,
  aura,
  balancer,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  curve,
  apyDefault,
  flux,
  idle,
  origin,
  stargate,
  yearn
} from "./resolver";
import { ADDRESS_ZERO } from "@/lib/helpers";

export const EMPTY_YIELD_RESPONSE = {
  total: 0,
  apy: [{
    rewardToken: ADDRESS_ZERO,
    apy: 0
  }]
}

export type AdapterApyResolver = (
  chainId: number,
  rpcUrl: string,
  address: string
) => Promise<Yield>;

export type AdapterApyResolvers = typeof AdapterApyResolvers;

export const AdapterApyResolvers: { [key: string]: ({ chainId, rpcUrl, address }: { chainId: number, rpcUrl: string, address: string }) => Promise<Yield> } = {
  aaveV2,
  aaveV3,
  aura,
  balancer,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  curve,
  flux,
  idle,
  origin,
  stargate,
  yearn,
  default: apyDefault
};

export default AdapterApyResolvers;