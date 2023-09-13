import { parseAbi } from "viem";

export const IDLE_CDO_ABI = parseAbi([
    "function getApr(address) view returns (uint)",
]);