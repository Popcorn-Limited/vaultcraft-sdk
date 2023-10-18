import { describe, test, expect, beforeAll } from "vitest";

import { CompoundV3 } from "../../../../src/yieldOptions/providers/protocols/compoundv3.js";
import { Clients } from "../../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const FORK_BLOCK_NUMBER = BigInt(18071114);
const compoundV3 = new CompoundV3(clients);

describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await compoundV3.getAssets(1);
        const want = [
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        ];
        expect(result).toEqual(want);
    });

    test("getApy() return correct APY for USDC", async () => {
        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const result = await compoundV3.getApy(1, usdc);
        expect(result.total).toBe(3.498848410598577);
    });

    test("getApy() return correct APY for WETH", async () => {
        const usdc = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        const result = await compoundV3.getApy(1, usdc);
        expect(result.total).toBe(3.176868981828341);
    });
});