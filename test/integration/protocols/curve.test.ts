import { describe, test, expect } from "vitest";
import { Curve } from "../../../src/lib/resolver/protocol/curve.js";
import { writeFileSync } from "fs";

const hour = 3600000;
const curve = new Curve(hour);

describe.concurrent("read-only", () => {
    test.only("getAssets() should return all the available assets", async () => {
        const result = await curve.getAssets(1);

        expect(result.length).toBeGreaterThan(0);
        const assets = JSON.stringify(result);
        writeFileSync("./curve_assets.json", assets, "utf8");
        console.log(result);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await curve.getApy(1, "0xc4ad29ba4b3c580e6d59105fff484999997675ff");
        expect(result.total).toBeGreaterThan(0);
    });

    test("getApy() should return a valid value for every asset", async () => {
        const assets = await curve.getAssets(1);

        const results = await Promise.all(assets.map(async (asset) => {
            return await curve.getApy(1, asset);
        }));
        results.forEach((result) => {
            expect(result.total).toBeGreaterThanOrEqual(0);
        });
    }, 10000);
});