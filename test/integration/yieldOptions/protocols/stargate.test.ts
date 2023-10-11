import { describe, test, beforeAll, expect } from "vitest";
import { Stargate } from "../../../../src/yieldOptions/providers/protocols/stargate.js";
import { Clients } from "../../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const stargate = new Stargate(clients, 1000);

const FORK_BLOCK_NUMBER = BigInt(18071114);
describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await stargate.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await stargate.getApy(1, "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56"); // stgUSDC
        // we can't set a static value here because we make a live API call. The value will change
        // continiously
        expect(result.total).toBeGreaterThan(0);
    });
});