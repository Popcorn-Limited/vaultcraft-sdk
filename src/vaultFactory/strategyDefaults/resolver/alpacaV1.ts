import { ADDRESS_ZERO } from "@/lib/constants";
import axios from "axios";
import { getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "..";

type VaultsResponse = {
    Vaults: {
        address: string
        baseToken: string
    }[]
}

const BASE_RESPONSE = {
    key: "alpacaV1",
    params: [{
        name: "alpacaVault",
        type: "address",
    }]
}

const TOKEN_ADDRESS = {
    56: "https://api.github.com/repos/alpaca-finance/bsc-alpaca-contract/contents/.mainnet.json",
    250: "https://api.github.com/repos/alpaca-finance/bsc-alpaca-contract/contents/.fantom_mainnet.json",
} as { [chainId: number]: string }

export async function alpacaV1({ chainId, client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const { data } = await axios.get(TOKEN_ADDRESS?.[chainId] || TOKEN_ADDRESS[56])
    const { Vaults: vaults } = JSON.parse(atob(data.content)) as VaultsResponse

    const vault = vaults.find(item => item.baseToken.toLowerCase() === address.toLowerCase())

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "alpacaVault", value: vault !== undefined ? getAddress(vault.address) : null }
        ]
    }
}