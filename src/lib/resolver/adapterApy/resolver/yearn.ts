import { Yield } from "src/yieldOptions/types"
import { EMPTY_YIELD_RESPONSE } from ".."

export async function yearn({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  let result;
  try {
    const res = await (await fetch(`https://api.yearn.finance/v1/chains/${chainId}/vaults/all`)).json()
    const vault = res.find((vault: any) => vault.token.address.toLowerCase() === address.toLowerCase())

    result = vault === undefined ?
      EMPTY_YIELD_RESPONSE :
      {
        total: vault.apy.net_apy * 100,
        apy: [{
          rewardToken: address.toLowerCase(),
          apy: vault.apy.net_apy * 100
        }]
      }
  } catch (e) {
    console.error(e)
    result = EMPTY_YIELD_RESPONSE
  }

  return result

}
