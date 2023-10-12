import { mainnet } from "viem/dist/types/chains";
import { StrategyDefault, StrategyDefaultResolverParams } from "..";
import { Address, getAddress } from "viem";

const BASE_RESPONSE = {
  params: [{
    name: "oToken",
    type: "address",
  }]
}

// @dev Make sure the keys here are correct checksum addresses
const WRAPPED_OTOKENS: { [key: string]: Address } = {
  "0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3": "0xDcEe70654261AF21C44c093C300eD3Bb97b78192", // oETH
  "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86": "0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62", // oUSD
}

export async function origin({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number
  return {
    ...BASE_RESPONSE,
    default: [
      { name: "oToken", value: chainId === mainnet.id ? (getAddress(WRAPPED_OTOKENS[address]) || null) : null }
    ]
  }
}