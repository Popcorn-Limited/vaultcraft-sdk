import { Address, PublicClient } from "viem";

import { VaultRegistryABI } from "./abi/VaultRegistryABI";
import { IVaultABI } from "./abi/IVaultABI";
import { Metadata } from "./types";

const ABI = VaultRegistryABI;
const vaultABI = IVaultABI;

export class VaultRegistry {
  address: Address;
  protected publicClient: PublicClient;
  private baseObj;


  constructor(address: Address, publicClient: PublicClient) {
    this.address = address;
    this.publicClient = publicClient;
    this.baseObj = {
      address,
      abi: ABI,
    };
  }

  getAllVaultAddresses(): Promise<Address[]> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    }) as Promise<Address[]>;
  }

  getVault(vault: Address): Promise<Metadata> {
    return this.metadata(vault);
  }

  private metadata(vault: Address): Promise<Metadata> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "metadata",
      args: [vault]
    })
      .then((data: readonly [`0x${string}`, `0x${string}`, `0x${string}`, string, `0x${string}`, bigint]) => {
        // Map the array values to the Metadata object
        return {
          vault: data[0],
          staking: data[1],
          creator: data[2],
          metadataCID: data[3],
          swapAddress: data[4],
          exchange: data[5]
        };
      });
  }

  async getVaultByDeployer(creator: Address): Promise<Address[]> {
    const allVaults: readonly Address[] = await this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    });

    return (await Promise.all(
      allVaults.map(async (vault: Address) => {
        const metaData: Metadata = await this.metadata(vault);
        return metaData.creator === creator ? vault : null;
      })
    )).filter(v => v !== null) as Address[];
  }
}