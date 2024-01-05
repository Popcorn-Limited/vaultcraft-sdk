import { mainnet } from "viem/chains";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";
import { getAddress } from "viem";
import { tranches } from "src/yieldOptions/providers/protocols/idle.js";

const BASE_RESPONSE = {
  params: [{
    name: "cdo",
    type: "address",
  }]
}

export async function idle({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number

  return {
    ...BASE_RESPONSE,
    default: [
      { name: "cdo", value: chainId === mainnet.id ? (getAddress(tranches[chainId][address].cdo) || null) : null }
    ]
  }
}