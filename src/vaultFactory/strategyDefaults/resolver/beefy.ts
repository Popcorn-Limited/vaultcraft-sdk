import { getAddress } from "viem";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";
import { ADDRESS_ZERO } from "@/lib/constants/index.js";
import axios from "axios";

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

    const vaults = (await axios.get(`https://api.beefy.finance/vaults/${networkNameByChainId[chainId]}`)).data as Vault[];
    const boosts = (await axios.get(`https://api.beefy.finance/boosts/${networkNameByChainId[chainId]}`)).data as Boost[];

    const vaultAddress = vaults.find(vault => getAddress(vault.tokenAddress) === getAddress(address))?.earnContractAddress;
    const boost = boosts.find(boost => getAddress(boost.tokenAddress) === getAddress(vaultAddress as string));


    return vaultAddress ?
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