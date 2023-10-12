import { getAddress } from "viem";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "..";
import { ADDRESS_ZERO } from "@/lib/constants";

interface Vault {
  tokenAddress: string;
  earnContractAddress: string;
}

interface Boost {
  tokenAddress: string;
  earnContractAddress: string;
  status: "active" | "eol"
}

const BASE_RESPONSE = {
  params: [{
    name: "beefyVault",
    type: "address",
  },
  {
    name: "beefyBooster",
    type: "address",
  }]
}

const networkNameByChainId: { [key: number]: string } = {
  1: "ethereum",
  137: "polygon",
  56: "bsc",
  250: "fantom",
  42161: "arbitrum",
  10: "optimism"
}

export async function beefy({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number
  if (Object.keys(networkNameByChainId).indexOf(chainId.toString()) === -1) {
    return ERROR_RESPONSE;
  } else {

    const vaults = await (await fetch(`https://api.beefy.finance/vaults/${networkNameByChainId[chainId]}`)).json() as Vault[];
    const boosts = await (await fetch(`https://api.beefy.finance/boosts/${networkNameByChainId[chainId]}`)).json() as Boost[];

    const vaultAddress = vaults.find(vault => vault.tokenAddress.toLowerCase() === address.toLowerCase())?.earnContractAddress;
    const boost = boosts.find(boost => boost.tokenAddress.toLowerCase() === vaultAddress?.toLowerCase());


    return !!vaultAddress ?
      {
        ...BASE_RESPONSE,
        default: [
          { name: "beefyVault", value: getAddress(vaultAddress) },
          {
            name: "beefyBooster", value: boost && boost.status === "active" ? getAddress(boost.earnContractAddress) : ADDRESS_ZERO
          }
        ]
      }
      : { ...BASE_RESPONSE, default: [{ name: "beefyVault", value: null }, { name: "beefyBooster", value: null }] }
  }
}