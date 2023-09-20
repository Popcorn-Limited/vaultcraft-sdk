import { describe, test, expect } from "vitest";
import { Convex } from "../../../src/yieldOptions/providers/protocols/convex.js";

const convex = new Convex(1000);

describe.concurrent("read-only", () => {
    test("getAssets() should return a list of assets", async () => {
        const result = await convex.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });
    
    test("getApy() should return the APY for a given asset", async () => {
        const result = await convex.getApy(1, "0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC");
        expect(result.total).toBeGreaterThan(0);
    });
});