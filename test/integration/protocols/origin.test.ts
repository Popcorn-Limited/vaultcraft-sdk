
import { describe, test, expect } from "vitest";
import { Origin } from "../../../src/yieldOptions/providers/protocols/origin.js";

const origin = new Origin();

describe.concurrent("read-only", () => {
    test("getAssets() should return all the available assets", async () => {
        const result = await origin.getAssets(1);
        const want = [
            "0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3", // oETH
            "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86" // oUSD
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await origin.getApy(1, "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86");
        // can't use static value because we query live API with continously changing data
        expect(result.total).toBeGreaterThan(0);
    });
});