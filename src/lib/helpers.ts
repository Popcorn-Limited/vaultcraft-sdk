import { InitParam, InitParamRequirement } from "@/lib/atoms/adapter"
import { isAddress } from "viem";
import { mainnet } from "wagmi";
import { arbitrum, bsc, goerli, localhost, optimism, polygon } from "wagmi/dist/chains";

export function noOp() { }

export const beautifyAddress = (addr: string) =>
  `${addr.slice(0, 4)}...${addr.slice(-5, 5)}`;

export function verifyInitParamValidity(
  value: string,
  inputParam: InitParam
): string[] {
  const errors: string[] = [];

  if (value === "") errors.push("Value is required");
  if (!inputParam.requirements) {
    switch (inputParam.type) {
      case "address":
        if (!isAddress(value)) errors.push("Must be a valid address");
    }
  }
  if (inputParam.requirements && inputParam.requirements.length > 0) {
    if (inputParam.requirements.includes(InitParamRequirement.NotAddressZero) &&
      value !== ADDRESS_ZERO) errors.push("Must not be zero address");

    if (inputParam.requirements.includes(InitParamRequirement.NotZero) && Number(value) === 0) errors.push("Must not be zero");
  }

  return errors;
}

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

export const networkNames = {
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

export const networkMap = {
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