import axios from "axios"

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

export async function alpacaV2({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
    let result: string[];
    try {
        const { data } = await axios.get("https://api.github.com/repos/alpaca-finance/alpaca-v2-money-market/contents/.mainnet.json")

        const { moneyMarket } = JSON.parse(atob(data.content)) as MoneyMarketResponse

        result = moneyMarket?.markets?.map(market => market.token) ?? []
    } catch (e) {
        console.error(e)
        result = [];
    }
    return result;
}