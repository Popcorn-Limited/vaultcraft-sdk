import { describe, test, expect } from "vitest";

import { publicClient } from "../setup.js";
import { YieldOptions } from "../../src/yieldOptions/index.js";
import { Clients } from "../../src/yieldOptions/providers/protocols/index.js";
import { MockProtocolProvider } from "../mocks/mockProtocolProvider.js";
import { ProtocolProvider } from "../../src/yieldOptions/providers/protocolProvider.js";

const clients: Clients = {
    1: publicClient,
};

test("getProtocols() should return a list of protocols for the given chain ID", () => {
    const ttl = 360_000;
    const yieldOptions = new YieldOptions(new ProtocolProvider(clients, ttl), ttl);
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

describe.concurrent("getAssets()", () => {
    test("should return a list of unique assets", async () => {
        const mockProtocolProvider = new MockProtocolProvider({
            1: {
                "aaveV2": {
                    "0xc4ad29ba4b3c580e6d59105fff484999997675ff": 12,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
                "idle": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockProtocolProvider, 360_000);
        const result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);
    });

    test("should use cached values if available", async () => {
        const protocolData = {
            1: {
                "aaveV2": {
                    "0xc4ad29ba4b3c580e6d59105fff484999997675ff": 12,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
                "idle": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
            },

        };
        const mockProtocolProvider = new MockProtocolProvider(protocolData);
        const yieldOptions = new YieldOptions(mockProtocolProvider, 360_000);
        let result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);

        // we add another address that shouldn't be included in the cached response
        protocolData[1].aaveV2["0x6B175474E89094C44Da98b954EedeAC495271d0F"] = 11;
        mockProtocolProvider.setData(protocolData);

        result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);
    });
});

describe.concurrent("getYieldOptionsByProtocol", () => {
    test("should return a list of assets and their apys for a given protocol", async () => {
        const mockProtocolProvider = new MockProtocolProvider({
            1: {
                "aaveV2": {
                    "0xc4ad29ba4b3c580e6d59105fff484999997675ff": 12,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
                "idle": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockProtocolProvider, 360_000);
        const result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                address: '0xc4ad29ba4b3c580e6d59105fff484999997675ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4ad29ba4b3c580e6d59105fff484999997675ff", apy: 12 }] }
            },
            {
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", apy: 10 }] }
            }
        ]);
    });

    test("should return the cached value if available", async () => {
        const mockProtocolProvider = new MockProtocolProvider({
            1: {
                "aaveV2": {
                    "0xc4ad29ba4b3c580e6d59105fff484999997675ff": 12,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
                "idle": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockProtocolProvider, 360_000);
        let result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                address: '0xc4ad29ba4b3c580e6d59105fff484999997675ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4ad29ba4b3c580e6d59105fff484999997675ff", apy: 12 }] }
            },
            {
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", apy: 10 }] }
            }
        ]);

        mockProtocolProvider.setAsset(1, "aaveV2", "0xc4ad29ba4b3c580e6d59105fff484999997675ff", 15);
        result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                address: '0xc4ad29ba4b3c580e6d59105fff484999997675ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4ad29ba4b3c580e6d59105fff484999997675ff", apy: 12 }] }
            },
            {
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", apy: 10 }] }
            }
        ]);
    });

    test("should use cached APY data if available", async () => {
        const mockProtocolProvider = new MockProtocolProvider({
            1: {
                "aaveV2": {
                    "0xc4ad29ba4b3c580e6d59105fff484999997675ff": 12,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
                "idle": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockProtocolProvider, 360_000);
        const apy = await yieldOptions.getApy(1, "aaveV2", "0xc4ad29ba4b3c580e6d59105fff484999997675ff");
        expect(apy).toEqual({
            total: 12,
            apy: [{
                apy: 12,
                rewardToken: "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            }],
        });

        mockProtocolProvider.setAsset(1, "aaveV2", "0xc4ad29ba4b3c580e6d59105fff484999997675ff", 15);

        let result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                address: '0xc4ad29ba4b3c580e6d59105fff484999997675ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4ad29ba4b3c580e6d59105fff484999997675ff", apy: 12 }] }
            },
            {
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", apy: 10 }] }
            }
        ]);
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