import { createPublicClient, http } from "viem"
import { networkMap } from "@/lib/helpers";
import { Yield } from "src/yieldOptions/types";

const CTOKEN = {
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "0xc3d688B66703497DAA19211EEdff47f25384cdc3", // USDC
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "0xA17581A9E3356d9A858b789D68B4d866e593aE94", // WETH
}

export async function compoundV3({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<Yield> {
  const comet = {
    // @ts-ignore
    address: CTOKEN[address.toLowerCase()],
    abi: ['function getSupplyRate(uint) public view returns (uint)',
      'function getUtilization() public view returns (uint)'],
  }

  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  })

  const utilization = await client.readContract({ ...comet, functionName: 'getUtilization' })
  const supplyRate = await client.readContract({ ...comet, functionName: 'getSupplyRate', args: [utilization] }) as BigInt

  const secondsPerYear = 60 * 60 * 24 * 365;
  const supplyApr = +(supplyRate).toString() / 1e18 * secondsPerYear * 100;

  return {
    total: supplyApr,
    apy: [{
      rewardToken: address.toLowerCase(),
      apy: supplyApr
    }]
  }
}
