import { describe, test, expect } from "vitest";
import { Aura } from "../../../src/yieldOptions/providers/protocols/aura.js";

const aura = new Aura(1000);

describe.concurrent("read-only", () => {
    test("getAssets() should return all the available assets", async () => {
        const result = await aura.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const rethWethPool = "0x1E19CF2D73a72Ef1332C882F20534B6519Be0276";
        const result = await aura.getApy(1, rethWethPool);
        expect(result.total).toBeGreaterThan(0);
    });
});