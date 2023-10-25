import { Address } from "viem";
import { IpfsClient } from "@/lib/ipfsClient.js";

export default async function getVaultName({ address, cid }: { address: Address, cid: string }): Promise<string | undefined> {
  if (["", "cid"].includes(cid)) return undefined
  return (await IpfsClient.get<{ name: string }>(cid)).name
}