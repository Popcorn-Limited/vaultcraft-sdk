import { describe, test, expect, beforeAll } from "vitest";

import { AaveV2 } from "../../../src/lib/resolver/protocol/aavev2.js";
import { Clients } from "../../../src/lib/resolver/protocol/index.js";
import { publicClient } from "../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const FORK_BLOCK_NUMBER = BigInt(18071114);
const aaveV2 = new AaveV2(clients);

describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await aaveV2.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const result = await aaveV2.getApy(1, usdc);
        expect(result.total).toBe(2.9330324332579485);
    });
});