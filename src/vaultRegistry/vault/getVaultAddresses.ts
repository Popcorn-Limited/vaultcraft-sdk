import { Address, PublicClient } from "viem";
import { VaultRegistryByChain } from "./getVault.js";
import { VaultRegistyAbi } from "@/lib/constants/abi/index.js";

export default async function getVaultAddresses({ client }: { client: PublicClient }): Promise<Address[]> {
  return client.readContract({
    address: VaultRegistryByChain[client.chain?.id as number],
    abi: VaultRegistyAbi,
    functionName: "getRegisteredAddresses",
  }) as Promise<Address[]>;
}