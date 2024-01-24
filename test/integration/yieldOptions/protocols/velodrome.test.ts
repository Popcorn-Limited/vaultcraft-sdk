import { describe, test, beforeAll, expect } from "vitest";
import { Velodrome } from "../../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../../setup.js";

const velodrome = new Velodrome(publicClient);

const FORK_BLOCK_NUMBER = BigInt(115000130);
describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    // this test can take a little longer because we query a live API. Should be changed in the future
    test("getAssets() should return all the available assets", async () => {
        const result = await velodrome.getAssets(10);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await velodrome.getApy(10, "0x0df083de449F75691fc5A36477a6f3284C269108");
        // we can't set a static value here because we make a live API call. The value will change
        // continiously
        expect(result.total).toBeGreaterThan(0);
    });
});