import { test, expect } from "vitest";
import { Balancer } from "../../../../src/yieldOptions/providers/protocols/balancer.js";

const balancer = new Balancer(1000);


test("getAssets() should return all the available assets", async () => {
    const result = await balancer.getAssets(1);
    expect(result.length).toBeGreaterThan(0);
});

test("getApy() should return the APY for a given asset", async () => {
    const rethWethPool = "0x1E19CF2D73a72Ef1332C882F20534B6519Be0276";
    const result = await balancer.getApy(1, rethWethPool);
    expect(result.total).toBeGreaterThan(0);
});

test("should return a valid APY for every asset", async () => {
    const assets = await balancer.getAssets(1);

    for (let asset of assets) {
        const apy = await balancer.getApy(1, asset);
        expect(apy.total).toBeGreaterThanOrEqual(0);
    }
}, 20_000);