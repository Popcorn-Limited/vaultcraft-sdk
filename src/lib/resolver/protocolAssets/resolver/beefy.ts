import { SUPPORTED_NETWORKS, transformNetwork } from "@/lib/helpers.js";

interface Vault {
  tokenAddress: string;
  status: string;
}

export async function beefy({ chainId, rpcUrl }: { chainId: number, rpcUrl: string }): Promise<string[]> {
  let result: string[];
  try {
    const network = transformNetwork(SUPPORTED_NETWORKS.find(chain => chain.id === chainId)?.network)
    const res = await (await fetch(`https://api.beefy.finance/vaults/${network}`)).json() as Vault[];

    result = res.filter(vault => vault.status === "active").map(vault => vault.tokenAddress) as string[];
  } catch (e) {
    console.error(e)
    result = [];
  }
  return result;
}