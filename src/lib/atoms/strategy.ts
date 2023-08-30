import type { AdapterConfig, InitParam } from "./adapter.js";
import strategies from "@/lib/constants/strategies.json";
import { atom } from "jotai";
import { stringToHex } from "viem";

export type Strategy = {
  name: string;
  key: string;
  description: string;
  logoURI: string;
  compatibleAdapters: string[];
  requiredAssets?: string[];
  requiredNetworks?: number[];
  initParams?: InitParam[];
  resolver?: string;
};

export const useStrategies = () => {
  return strategies as any as Array<Strategy>;
};

export const DEFAULT_STRATEGY = {
  name: "Choose a Strategy",
  key: "none",
  description: "none",
  logoURI: "",
  compatibleAdapters: [],
};

export const strategyAtom = atom<Strategy>(DEFAULT_STRATEGY);

export const strategyConfigAtom = atom<any[]>([]);
export const strategyDeploymentAtom = atom<AdapterConfig>({ id: stringToHex("", { size: 32 }), data: "0x" });