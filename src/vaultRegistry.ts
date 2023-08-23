import { Hash, Address, PublicClient, WalletClient, Transport, Chain, ParseAccount, Account, WriteContractParameters } from "viem";

import { VaultRegistryABI } from "./abi/VaultRegistryABI";
import { VaultFees, WriteOptions } from "./types";

const ABI = VaultRegistryABI;

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

  getVault(vault: Address): Promise<any> {
    const metadata = this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getVault",
      args: [vault]
    });
    
    // returns 
    /* {
        name:string,
        symbol:string,
        decimals:number,
        vault:Address,
        asset:Address,
        adapter:Address,
        creator:Address,
        metadataCID:string,
        totalAssets:bigint,
        totalSupply:bigint,
        pricePerShare:bigint
      }
    */
  }

  getVaultAddressesByAsset(asset: Address): Promise<Address[]> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getVaultsByAsset",
      args: [asset]
    }) as Promise<Address[]>;
  }

  async getVaultsAddressesByCreator(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<any> {
    const vaultAddresses = this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    }) as Promise<Address[]>;
  }

  getAllVaultAddresses(): Promise<Address[]> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    }) as Promise<Address[]>;
  }

  async getAllVaults(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<any> {
    const vaultAddresses = this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    }) as Promise<Address[]>;
  }
}