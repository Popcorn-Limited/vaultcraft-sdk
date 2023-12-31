import axios from "axios"
import { getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

type MoneyMarketResponse = {
    moneyMarket: {
        markets: {
            debtToken: string
            token: string
            ibToken: string
            interestModel: string
        }[]
    }
}

const BASE_RESPONSE = {
    params: [{
        name: "alpacaVault",
        type: "address",
    }]
}

export async function alpacaV2({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const { data } = await axios.get("https://api.github.com/repos/alpaca-finance/alpaca-v2-money-market/contents/.mainnet.json")

    const { moneyMarket } = JSON.parse(atob(data.content)) as MoneyMarketResponse

    const matchingMarket = moneyMarket.markets.find(market => getAddress(market.token) === getAddress(address))

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "alpacaVault", value: matchingMarket?.ibToken ? getAddress(matchingMarket?.ibToken) : null }
        ]
    }
}
