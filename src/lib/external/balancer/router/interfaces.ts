import { Address } from "viem";

export interface BalancerData {
    sellToken: Address,
    buyToken: Address,
    orderKind: "sell" | "buy",
    amount: string,
    gasPrice: string
}

export enum SwapKind {
    GIVEN_IN = "GIVEN_IN",
    GIVEN_OUT = "GIVEN_OUT"
}

export interface BatchSwapStep {
    poolId: string;
    assetInIndex: bigint;
    assetOutIndex: bigint;
    amount: bigint;
    userData: string;
}

interface SwapResponse extends BatchSwapStep {
    returnAmount: string;
}

export interface BatchSwapStruct {
    poolId: string;
    assetInIndex: bigint;
    assetOutIndex: bigint;
}

export interface FundManagement {
    sender: string;
    fromInternalBalancer: boolean;
    recipient: string;
    toInternalBalance: boolean;
}

export interface BalanceSORResponse {
    marketSp: string;
    returnAmount: string;
    returnAmountConsideringFees: string;
    returnAmountFromSwaps: string;
    swapAmount: string;
    swapAmountFromSwaps: string;
    swaps: SwapResponse[];
    tokenAddresses: string[];
    tokenIn: string;
    tokenOut: string;
}

