import { atom } from "jotai";
import { mainnet } from "wagmi";
import type { Chain } from "wagmi";

export const networkAtom = atom<Chain>(mainnet);
