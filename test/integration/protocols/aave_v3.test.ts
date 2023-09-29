import { describe, test, expect, beforeAll } from "vitest";

import { AaveV3 } from "../../../src/yieldOptions/providers/protocols/aavev3.js";
import { Clients } from "../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const FORK_BLOCK_NUMBER = BigInt(18071114);
const aaveV3 = new AaveV3(clients);

describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await aaveV3.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const result = await aaveV3.getApy(1, usdc);
        expect(result.total).toBe(2.7705718169595728);
    });
});