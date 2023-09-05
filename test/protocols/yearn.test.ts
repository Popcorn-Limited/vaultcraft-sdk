import { describe, test, beforeAll, expect } from "vitest";
import { Yearn } from "../../src/lib/resolver/protocol/yearn.js";
import { Clients } from "../../src/lib/resolver/protocol/index.js";
import { publicClient } from "../setup.js";

const clients: Clients = {
    1: publicClient,
};
const yearn = new Yearn(clients);

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
    }, 10000);

    test("getApy() should return the APY for a given asset", async () => {
        const result = await yearn.getApy(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
        expect(result.total).toBe(3.6890136422520703);
    });
});