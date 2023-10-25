import { Address, PublicClient, ReadContractParameters, getAddress, parseEther } from "viem"
import axios from "axios"
import { ERC20Abi, VaultAbi, VaultRegistyAbi } from "@/lib/constants/abi/index.js"
import { ADDRESS_ZERO, ZERO, networkMap } from "@/lib/helpers.js"
import getAssetIcon from "./getAssetIcon.js"
import getOptionalMetadata from "./getOptionalMetadata.js"
import getVaultName from "./getVaultName.js"
import { getTokenPrice } from "@/lib/getTokenPrice.js"
import type { VaultData } from "../types.js"
import type { Token } from "src/types.js"

export const VaultRegistryByChain: { [key: number]: Address } = {
  1: "0x007318Dc89B314b47609C684260CfbfbcD412864",
  137: "0x2246c4c469735bCE95C120939b0C078EC37A08D0",
  10: "0xdD0d135b5b52B7EDd90a83d4A4112C55a1A6D23A",
  42161: "0xB205e94D402742B919E851892f7d515592a7A6cC",
}

function prepareVaultContract(vault: Address, account: Address): ReadContractParameters[] {
  const vaultContract = {
    address: vault,
    abi: VaultAbi
  }

  return [
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
    {
      ...vaultContract,
      functionName: 'balanceOf',
      args: [account]
    }
  ]
}

function prepareRegistryContract(address: Address, vault: Address): ReadContractParameters {
  const vaultRegisty = {
    address,
    abi: VaultRegistyAbi
  }

  return {
    ...vaultRegisty,
    functionName: 'metadata',
    args: [vault]
  }
}

function prepareTokenContracts(address: Address, account: Address): ReadContractParameters[] {
  const token = {
    address,
    abi: ERC20Abi
  }
  return [
    {
      ...token,
      functionName: 'name',
    },
    {
      ...token,
      functionName: 'symbol',
    },
    {
      ...token,
      functionName: 'balanceOf',
      args: [account]
    }
  ]
}

interface GetVaultProps {
  vaults: Address[];
  account?: Address;
  owner?: Address;
  client: PublicClient;
}

export async function getVaults({ vaults, account = ADDRESS_ZERO, owner, client }: GetVaultProps): Promise<VaultData[]> {
  // TODO limit batch size to 50
  const hasAccount = account !== ADDRESS_ZERO
  const chainId = client.chain?.id as number

  // Add vaultName and metadata
  const registryMetadata = await client.multicall({
    // @ts-ignore
    contracts: vaults.map(vault => prepareRegistryContract(VaultRegistryByChain[chainId], vault)).flat(),
    allowFailure: false
  }) as unknown as string[][]

  let result = registryMetadata.map((entry, i) => {
    return {
      address: getAddress(vaults[i]),
      metadata: {
        creator: getAddress(entry[2]),
        cid: entry[3] as string,
      }
    }
  })
  if (owner) result = result.filter(entry => entry.metadata.creator === getAddress(owner))

  // Get core metadata
  const vaultData = await client.multicall({
    // @ts-ignore
    contracts: vaults.map(vault => prepareVaultContract(vault, account)).flat(),
    allowFailure: false
  })

  // Add core metadata
  result = vaultData.map((vault, i) => {
    if (i > 0) i = i * 10
    const assetsPerShare = (vaultData[i + 6] as bigint) > ZERO ? (vaultData[i + 5] as bigint) / (vaultData[i + 6] as bigint) : BigInt(1e-9)
    const fees = vaultData[i + 7] as [bigint, bigint, bigint, bigint]
    return {
      ...result[i],
      vault: {
        address: getAddress(result[i].address),
        name: String(vaultData[i + 0]),
        symbol: String(vaultData[i + 1]),
        decimals: Number(vaultData[i + 2]),
        logoURI: "https://app.pop.network/images/tokens/pop.svg",
        balance: hasAccount ? vaultData[i + 9] : ZERO
      },
      assetAddress: getAddress(vaultData[i + 3] as string),
      adapterAddress: getAddress(vaultData[i + 4] as string),
      totalAssets: vaultData[i + 5],
      totalSupply: vaultData[i + 6],
      assetsPerShare: assetsPerShare,
      fees: {
        deposit: fees[0],
        withdrawal: fees[1],
        management: fees[2],
        performance: fees[3],
      },
      depositLimit: vaultData[i + 8],
      chainId: chainId
    }
  })

  // Add token and adapter metadata
  const assetAndAdapterMeta = await client.multicall({
    // @ts-ignore
    contracts: result.map(data => [...prepareTokenContracts(data.assetAddress, account), ...prepareTokenContracts(data.adapterAddress, account)]).flat(),
    allowFailure: false
  })
  // @ts-ignore -- @dev ts doesnt like the type override from asset and adapter as `Address` to `Token`
  result = result.map((entry, i) => {
    if (i > 0) i = i * 6
    const asset = {
      address: getAddress(entry.assetAddress),
      name: String(assetAndAdapterMeta[i]),
      symbol: String(assetAndAdapterMeta[i + 1]),
      decimals: entry.vault.decimals - 9,
      logoURI: "",
      balance: hasAccount ? assetAndAdapterMeta[i + 2] : ZERO,
      price: Bigint,
    } as Token
    const adapter = {
      address: getAddress(entry.adapterAddress),
      name: String(assetAndAdapterMeta[i + 3]),
      symbol: String(assetAndAdapterMeta[i + 4]),
      decimals: entry.vault.decimals,
      logoURI: "",  // wont be used, just here for consistency
      balance: ZERO,
      price: ZERO,
    } as Token
    return {
      ...entry,
      asset,
      assetToken: {
        ...asset,
        logoURI: getAssetIcon({ asset, adapter, chainId: chainId })
      },
      adapter
    }
  })

  // Add prices
  const { data } = await axios.get(`https://coins.llama.fi/prices/current/${String(result.map(
    // @ts-ignore -- @dev ts still thinks entry.asset is just an `Address`
    entry => `${networkMap[client.chain.id].toLowerCase()}:${entry.asset.address}`
  ))}`)
  result = result.map((entry, i) => {
    const key = `${networkMap[chainId].name.toLowerCase()}:${entry.asset.address}`
    const assetPrice = Number(data.coins[key]?.price || 0)
    const pricePerShare = entry.assetsPerShare * assetPrice
    return {
      ...entry,
      vault: { ...entry.vault, price: pricePerShare * 1e9 }, // @dev -- normalize vault price for previews (watch this if errors occur)
      asset: { ...entry.asset, price: assetPrice },
      assetPrice: assetPrice,
      pricePerShare: pricePerShare,
      // @ts-ignore -- @dev ts still thinks entry.asset is just an `Address`
      tvl: (entry.totalSupply * pricePerShare) / (10 ** entry.asset.decimals)
    }
  })

  const vaultNames = await Promise.all(result.map(async (entry) => getVaultName({ address: entry.address, cid: entry.metadata.cid })))
  result = result.map((entry, i) => {
    return {
      ...entry,
      metadata: {
        ...entry.metadata,
        vaultName: vaultNames[i],
        optionalMetadata: getOptionalMetadata({ vaultAddress: entry.address, asset: entry.asset as Token, adapter: entry.adapter as Token })
      }
    }
  })

  return result as VaultData[]
}


export async function getVault({ vault, account = ADDRESS_ZERO, client }: { vault: Address, account?: Address, client: PublicClient }): Promise<VaultData> {
  const hasAccount = account !== ADDRESS_ZERO
  const chainId = client.chain?.id as number

  const results = await client.multicall({
    // @ts-ignore
    contracts: prepareVaultContract(vault, account),
    allowFailure: false
  })
  const registryMetadata = await client.readContract(prepareRegistryContract(VaultRegistryByChain[chainId], vault)) as unknown as string[]
  const vaultName = await getVaultName({ address: getAddress(vault), cid: registryMetadata[3] })

  const price = await getTokenPrice({ chainId: chainId, address: results[3] as Address })
  const assetsPerShare = Number(results[6]) > 0 ? Number(results[5]) / Number(results[6]) : Number(1)
  const pricePerShare = assetsPerShare * price
  const fees = results[7] as [BigInt, BigInt, BigInt, BigInt]

  // Add token and adapter metadata
  const assetAndAdapterMeta = await client.multicall({
    // @ts-ignore
    contracts: [...prepareTokenContracts(results[3] as Address, account), ...prepareTokenContracts(results[4] as Address, account)].flat(),
    allowFailure: false
  })
  const asset = {
    address: getAddress(results[3] as string),
    name: String(assetAndAdapterMeta[0]),
    symbol: String(assetAndAdapterMeta[1]),
    decimals: Number(results[2]) - 9,
    logoURI: "",
    balance: hasAccount ? Number(assetAndAdapterMeta[2]) : 0,
    price: price
  }
  const adapter = {
    address: getAddress(results[4] as string),
    name: String(assetAndAdapterMeta[3]),
    symbol: String(assetAndAdapterMeta[4]),
    decimals: Number(results[2]),
    logoURI: "", // wont be used, just here for consistency,
    balance: ZERO, // wont be used, just here for consistency,
    price: ZERO, // wont be used, just here for consistency,
  }
  return {
    address: getAddress(vault),
    vault: {
      address: getAddress(vault),
      name: String(results[0]),
      symbol: String(results[1]),
      decimals: Number(results[2]),
      logoURI: "https://app.pop.network/images/tokens/pop.svg",
      balance: hasAccount ? Number(results[9]) : 0,
      price: pricePerShare * 1e9,  // @dev -- normalize vault price for previews (watch this if errors occur)
    },
    asset: { ...asset, logoURI: getAssetIcon({ asset, adapter, chainId: chainId }) },
    adapter,
    totalAssets: Number(results[5]),
    totalSupply: Number(results[6]),
    assetsPerShare: assetsPerShare,
    assetPrice: price,
    pricePerShare: pricePerShare,
    tvl: (Number(results[6]) * pricePerShare) / (10 ** (Number(results[2]) - 9)),
    fees: {
      deposit: Number(fees[0]),
      withdrawal: Number(fees[1]),
      management: Number(fees[2]),
      performance: Number(fees[3]),
    },
    depositLimit: Number(results[8]),
    metadata: {
      creator: registryMetadata[2] as Address,
      cid: registryMetadata[3] as string,
      vaultName: vaultName,
      optionalMetadata: getOptionalMetadata({ vaultAddress: getAddress(vault), asset: asset, adapter: adapter })
    },
    chainId: chainId
  }
}