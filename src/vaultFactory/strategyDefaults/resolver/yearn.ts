import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
  params: [{
    name: "maxLoss",
    type: "uint256",
  }]
}

export async function yearn({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  // @dev maxLoss in BPS
  return {
    ...BASE_RESPONSE,
    default: [
      { name: "maxLoss", value: 1 }
    ]
  }
}