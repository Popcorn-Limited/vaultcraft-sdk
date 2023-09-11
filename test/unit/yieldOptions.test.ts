import { describe, test, expect, beforeAll } from "vitest";

import { publicClient } from "../setup.js";
import { YieldOptions } from "../../src/yieldOptions/index.js";
import { Clients } from "../../src/lib/resolver/protocol/index.js";
import { writeFileSync } from "fs";

const clients: Clients = {
    1: publicClient,
};
const yieldOptions = new YieldOptions(clients, 360000);
const FORK_BLOCK_NUMBER = BigInt(17883751);

describe.concurrent("read-only", () => {

    // beforeAll(async () => {
    //     await publicClient.reset({
    //         blockNumber: FORK_BLOCK_NUMBER,
    //     });
    // });

    // test("setup network", async () => {
    //     const success = await yieldOptions.setupNetwork(1);
    //     expect(success).toBe(true);
    // }, 100_000);

    // test("test", async () => {
    //     await yieldOptions.setupCache(1);
    // }, 100_000);

    test("getProtocols() should return a list of protocols for the given chain ID", () => {
        const result = yieldOptions.getProtocols(1);
        const want = [
            'aaveV2',
            'aaveV3',
            'aura',
            'beefy',
            'compoundV2',
            'curve',
            'idle',
            'origin',
            'yearn'
        ];
        expect(result).toEqual(want);
    });

    test("getAssets() should return a list of all the assets we support", async () => {
        // TODO: we can't really check the result against a 
        const result = await yieldOptions.getAssets(1);
        expect(result.length).toBeGreaterThan(0);
    });
});

// Priority:
// - Beefy ->> DONE
// - Convex/Aura
// - Curve/Balancer
// - Idle ->> DONE
// - Origin ->> DONE
// - Aave V3 ->> DONE
// - Compound V3