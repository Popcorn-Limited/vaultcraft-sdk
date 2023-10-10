import { StrategyDefault, StrategyDefaultResolverParams } from "..";

const BASE_RESPONSE = {
  key: "",
  params: [{
    name: "maxLoss",
    type: "uint256",
  }]
}

export async function yearn({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  // @dev maxLoss in BPS
  return {
    ...BASE_RESPONSE,
    default: [
      { name: "maxLoss", value: 1 }
    ]
  }
}