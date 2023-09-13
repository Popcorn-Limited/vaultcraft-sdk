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
            "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
            "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
            "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // stETH
            "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"  // Matic
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const result = await idle.getApy(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
        expect(result.total).toBe(16.07897128568019);
    }, 10_000);
});