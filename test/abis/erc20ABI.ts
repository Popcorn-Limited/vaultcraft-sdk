import { parseAbi } from "viem";

export const ERC20ABI = parseAbi([
    "function approve(address,uint) external",
]);