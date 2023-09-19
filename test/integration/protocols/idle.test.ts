import { describe, test, beforeAll, expect } from "vitest";
import { Idle } from "../../../src/yieldOptions/providers/protocols/idle.js";
import { Clients } from "../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const idle = new Idle(clients);

const FORK_BLOCK_NUMBER = BigInt(18071114);
describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await idle.getAssets(1);
        const want = [
            "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
            "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
            "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"  // Matic
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await idle.getApy(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
        expect(result.total).toBe(16.07897128568019);
    }, 10_000);
});