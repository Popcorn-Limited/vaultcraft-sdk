import { localhost, mainnet } from "wagmi/chains";
import ProtocolAssetResolvers from "./index.js";

export async function resolveProtocolAssets({ chainId, rpcUrl, resolver }: { chainId: number, rpcUrl: string, resolver?: string }): Promise<string[]> {
  if (chainId === localhost.id) chainId = mainnet.id;
  return resolver ? await ProtocolAssetResolvers[resolver]({ chainId, rpcUrl }) : await ProtocolAssetResolvers.default({ chainId, rpcUrl })
}