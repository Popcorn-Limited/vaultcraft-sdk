import axios from "axios";
import { getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

type VaultsResponse = {
    Vaults: {
        address: string
        baseToken: string
    }[]
}

const BASE_RESPONSE = {
    params: [{
        name: "alpacaVault",
        type: "address",
    }]
}

const TOKEN_ADDRESS = {
    56: "https://api.github.com/repos/alpaca-finance/bsc-alpaca-contract/contents/.mainnet.json",
    250: "https://api.github.com/repos/alpaca-finance/bsc-alpaca-contract/contents/.fantom_mainnet.json",
} as { [chainId: number]: string }

export async function alpacaV1({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const chainId = client.chain?.id as number
    const { data } = await axios.get(TOKEN_ADDRESS?.[chainId])
    const { Vaults: vaults } = JSON.parse(atob(data.content)) as VaultsResponse

    const vault = vaults.find(item => getAddress(item.baseToken) === getAddress(address))

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "alpacaVault", value: vault ? getAddress(vault.address) : null }
        ]
    }
}