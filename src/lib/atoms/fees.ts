
import { atom } from "jotai";
import { ZERO } from "../helpers.js";

export type VaultFees = {
  deposit: BigInt;
  withdrawal: BigInt;
  performance: BigInt;
  management: BigInt;
  recipient: string;
};

const DEFAULT_FEES = {
  deposit: ZERO,
  withdrawal: ZERO,
  performance: ZERO,
  management: ZERO,
  recipient: "",
};

export const feeAtom = atom<VaultFees>(DEFAULT_FEES);

