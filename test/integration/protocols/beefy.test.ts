import { describe, test, expect } from "vitest";
import { Beefy } from "../../../src/yieldOptions/providers/protocols/beefy.js";


const beefy = new Beefy(360000);

describe.concurrent("read-only", () => {
    test("getAssets() should return all the available assets", async () => {
        const result = await beefy.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    }, 10000);

    test("getApy() should return the APY for a given asset", async () => {
        const tricryptoUSDC = "0x7F86Bf177Dd4F3494b841a37e810A34dD56c829B";
        const result = await beefy.getApy(1, tricryptoUSDC);
        // we can't set a static value here because we make a live API call. The value will change
        // continiously
        expect(result.total).toBeGreaterThan(0);
    }, 20000);

    test("getApy() should return a valid value for every asset", async () => {
        const assets = await beefy.getAssets(1);

        const results = await Promise.all(assets.map(async (asset) => {
            return await beefy.getApy(1, asset);
        }));
        results.forEach((result) => {
            expect(result.total).toBeGreaterThanOrEqual(0);
        });
    }, 20000);
});