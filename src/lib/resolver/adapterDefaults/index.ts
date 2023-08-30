
import {
  alpacaV1,
  alpacaV2,
  aura,
  balancer,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  curve,
  initDefault,
  ellipsis,
  flux,
  gearbox,
  idle,
  origin,
  stargate,
  velodrome,
  yearn,
} from "./resolver/index.js";

export type AdapterDefaultResolver = (
  chainId: number,
  rpcUrl: string,
  address: string
) => Promise<any>;

export type AdapterDefaultResolvers = typeof AdapterDefaultResolvers;

export const AdapterDefaultResolvers: { [key: string]: ({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }) => Promise<any[]> } = {
  alpacaV1,
  alpacaV2,
  aura,
  balancer,
  beefy,
  compoundV2,
  compoundV3,
  convex,
  curve,
  ellipsis,
  flux,
  gearbox,
  idle,
  origin,
  stargate,
  velodrome,
  yearn,
  default: initDefault,
};

export default AdapterDefaultResolvers;