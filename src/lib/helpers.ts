import { mainnet, arbitrum, bsc, goerli, localhost, optimism, polygon, Chain } from "viem/chains";
import assets from "./constants/assets";
import { Token } from "src/types";

export function noOp() { }

export const beautifyAddress = (addr: string) =>
  `${addr.slice(0, 4)}...${addr.slice(-5, 5)}`;

export const validateBigNumberInput = (value?: string | number) => {
  const formatted =
    value === "." ? "0" : (`${value || "0"}`.replace(/\.$/, ".0") as any);
  return {
    formatted,
    isValid: value === "" || isFinite(Number(formatted)),
  };
};

export function transformNetwork(network: string | undefined): string {
  switch (network) {
    case "homestead":
    case undefined:
      return "ethereum";
    case "matic":
      return "polygon";
    default:
      return network.toLowerCase();
  }
}

export function cleanFileName(fileName: string): string {
  return fileName.replace(/ /g, "-").replace(/[^a-zA-Z0-9]/g, "");
}

export function getAssetsByChain(chainId: number): Token[] {
  return assets.filter((asset) => asset.chains.includes(chainId)).map((asset) => {
    return {
      address: asset.address[chainId],
      name: asset.name,
      symbol: asset.symbol,
      decimals: asset.decimals,
      logoURI: asset.logoURI,
      balance: ZERO,
      price: ZERO
    }
  });
}

export enum ChainId {
  Ethereum = 1,
  Goerli = 5,
  Arbitrum = 42161,
  Polygon = 137,
  Localhost = 1337,
  BNB = 56,
  Optimism = 10,
  ALL = 0,
}

export const networkNames: { [key: number]: string } = {
  [ChainId.Ethereum]: "Ethereum",
  [ChainId.Goerli]: "Goerli",
  [ChainId.Arbitrum]: "Arbitrum",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Localhost]: "Localhost",
  [ChainId.Optimism]: "Optimism",
  [ChainId.BNB]: "BNB",
  [ChainId.ALL]: "All Networks",
};

export const SUPPORTED_NETWORKS = [mainnet, localhost];

export const networkMap: { [key: number]: Chain } = {
  [ChainId.Ethereum]: mainnet,
  [ChainId.Goerli]: goerli,
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Polygon]: polygon,
  [ChainId.Localhost]: localhost,
  [ChainId.Optimism]: optimism,
  [ChainId.BNB]: bsc,
}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const MAX_INT256 = BigInt(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
export const MAX_UINT256 = BigInt(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
export const MINUS_ONE = BigInt(-0x01)
export const ZERO = BigInt(0)