
import { describe, test, expect } from "vitest";
import { Origin } from "../../../src/yieldOptions/providers/protocols/origin.js";

const origin = new Origin();

describe.concurrent("read-only", () => {
    test("getAssets() should return all the available assets", async () => {
        const result = await origin.getAssets(1);
        const want = [
            "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3", // oETH
            "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86" // oUSD
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await origin.getApy(1, "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86");
        // can't use static value because we query live API with continously changing data
        expect(result.total).toBeGreaterThan(0);
    });
});