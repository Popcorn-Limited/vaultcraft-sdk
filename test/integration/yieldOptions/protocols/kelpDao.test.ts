import { describe, test, beforeAll, expect } from "vitest";
import { KelpDao, Stader } from "../../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../../setup.js";

const kelpDao = new KelpDao();

const FORK_BLOCK_NUMBER = BigInt(19073000);
describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    // this test can take a little longer because we query a live API. Should be changed in the future
    test("getAssets() should return all the available assets", async () => {
        const result = await kelpDao.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await kelpDao.getApy(1, "0xBCe0Cf87F513102F22232436CCa2ca49e815C3aC");
        // we can't set a static value here because we make a live API call. The value will change
        // continiously
        expect(result.total).toBeGreaterThan(0);
    });
});