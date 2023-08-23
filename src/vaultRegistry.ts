import { Address, PublicClient } from "viem";

import { VaultRegistryABI } from "./abi/VaultRegistryABI";
import { IVaultABI } from "./abi/IVaultABI";
import { Vault } from "./types";

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

  async getVault(vault: Address): Promise<Vault> {
    const metadata = await this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getVault",
      args: [vault]
    });
    return this._getVault(vault, metadata);
  }

  private async _getVault(vault: Address, metadata: any): Promise<Vault> {
    const vaultContract = {
      address: vault,
      abi: vaultABI
    }
    const results = await this.publicClient.multicall({
      contracts: [
        {
          ...vaultContract,
          functionName: 'name',
        },
        {
          ...vaultContract,
          functionName: 'symbol',
        },
        {
          ...vaultContract,
          functionName: 'decimals'
        },
        {
          ...vaultContract,
          functionName: 'asset'
        },
        {
          ...vaultContract,
          functionName: 'adapter'
        },
        {
          ...vaultContract,
          functionName: 'totalAssets'
        },
        {
          ...vaultContract,
          functionName: 'totalSupply'
        },
        {
          ...vaultContract,
          functionName: 'fees'
        },
        {
          ...vaultContract,
          functionName: 'depositLimit'
        },
      ]
    })

    return {
      address: vault,
      name: results[0],
      symbol: results[1],
      decimals: results[2],
      asset: results[3],
      adapter: results[4],
      totalAssets: results[5],
      totalSupply: results[6],
      pricePerShare: (results[5] || 1) as bigint / (results[6] || 1) as bigint,
      fees: results[7],
      depositLimit: results[8],
      creator: metadata.creator,
      metadataCID: metadata.metadataCID
    }
  }

  async getVaultsByCreator(creator: Address): Promise<Vault[]> {
    const addresses = await this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    })

    const metadatas = await this.publicClient.multicall({
      contracts: addresses.map((address) => {
        return {
          ...this.baseObj,
          functionName: "getVault",
          args: [address]
        }
      })
    })

    return Promise.all(metadatas.filter(
      (metadata) => metadata.result.creator.toLowerCase() === creator.toLowerCase())
      .map((metadata) => this._getVault(metadata.result.vault, metadata.result)))
  }

  getVaultAddressesByAsset(asset: Address): Promise<Address[]> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getVaultsByAsset",
      args: [asset]
    }) as Promise<Address[]>;
  }

  getAllVaultAddresses(): Promise<Address[]> {
    return this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    }) as Promise<Address[]>;
  }

  async getAllVaults(): Promise<Vault[]> {
    const addresses = await this.publicClient.readContract({
      ...this.baseObj,
      functionName: "getRegisteredAddresses",
    })

    const metadatas = await this.publicClient.multicall({
      contracts: addresses.map((address) => {
        return {
          ...this.baseObj,
          functionName: "getVault",
          args: [address]
        }
      })
    })

    return Promise.all(metadatas.map((metadata) => this._getVault(metadata.result.vault, metadata.result)))
  }
}