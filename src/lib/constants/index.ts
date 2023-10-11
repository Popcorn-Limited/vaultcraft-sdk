import { Address } from "viem";
import { mainnet, arbitrum, bsc, goerli, localhost, optimism, polygon, Chain } from "viem/chains";

export const ADDRESS_ZERO: Address = "0x0000000000000000000000000000000000000000"

export const ZERO = BigInt(0);

export const MAX_INT256 = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export const EMPTY_BYTES = "0x"

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