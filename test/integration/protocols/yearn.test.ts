import { describe, test, beforeAll, expect } from "vitest";
import { Yearn } from "../../../src/yieldOptions/providers/protocols/yearn.js";
import { Clients } from "../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const yearn = new Yearn(clients, 360_000);

const FORK_BLOCK_NUMBER = BigInt(18071114);
describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    // this test can take a little longer because we query a live API. Should be changed in the future
    test("getAssets() should return all the available assets", async () => {
        const result = await yearn.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await yearn.getApy(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
        // we can't set a static value here because we make a live API call. The value will change
        // continiously
        expect(result.total).toBeGreaterThan(0);
    });
});