import { resolveAdapterDefaults } from "@/lib/resolver/adapterDefaults/adapterDefaults";
import { createPublicClient, http } from "viem";
import { networkMap } from "@/lib/helpers";

export async function compoundV2Apy({ chainId, rpcUrl, address, resolver }: { chainId: number, rpcUrl: string, address: string, resolver: string; }): Promise<number> {
  const [cTokenAddress] = await resolveAdapterDefaults({ chainId, rpcUrl, address, resolver });

  const client = createPublicClient({
    // @ts-ignore
    chain: networkMap[chainId],
    transport: http(rpcUrl)
  });

  const supplyRate = await client.readContract({
    // @ts-ignore
    address: cTokenAddress,
    abi: ['function supplyRatePerBlock() public view returns (uint)'],
    functionName: 'supplyRatePerBlock'
  }) as BigInt;

  return (((Math.pow((Number(supplyRate) / 1e18 * 7200) + 1, 365))) - 1) * 100;
}

export async function compoundV2({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string; }): Promise<number> {
  return compoundV2Apy({ chainId, rpcUrl, address, resolver: "compoundV2" });
}
