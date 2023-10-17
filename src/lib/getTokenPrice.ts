import axios from "axios"
import { Address } from "viem"
import { networkMap } from "./helpers"

const BASE_URL = "https://coins.llama.fi/prices/current/"

export async function getTokenPrice({ address, chainId }: { address: Address, chainId: number }): Promise<number> {
  const key = `${networkMap[chainId].name.toLowerCase()}:${address}`
  const { data } = await axios.get(`${BASE_URL}${key}`)

  return Object.keys(data.coins).length === 0 ?
    // Llama didnt find the token, return 0
    0 :
    data.coins[key].price
}
