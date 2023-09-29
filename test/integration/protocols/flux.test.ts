import { describe, test, expect, beforeAll } from "vitest";

import { Flux } from "../../../src/yieldOptions/providers/protocols/flux.js";
import { publicClient } from "../../setup.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);
const flux = new Flux(publicClient);

describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await flux.getAssets(1);
        const want = [
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            '0x853d955aCEf822Db058eb8505911ED77F175b99e',
            '0x1B19C19393e2d034D8Ff31ff34c81252FcBbee92',
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const result = await flux.getApy(1, usdc);
        expect(result.total).toBe(4.3176191240318795);
    });
});