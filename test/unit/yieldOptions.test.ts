import { describe, test, expect } from "vitest";

import { publicClient } from "../setup.js";
import { LiveProvider, YieldOptions } from "../../src/yieldOptions/index.js";
import { Clients } from "../../src/yieldOptions/providers/protocols/index.js";
import { MockLiveProvider } from "../mocks/mockProtocolProvider.js";

const clients: Clients = {
    1: publicClient,
};

test("getProtocols() should return a list of protocols for the given chain ID", () => {
    const ttl = 360_000;
    const yieldOptions = new YieldOptions(new LiveProvider(clients, ttl), ttl);
    const result = yieldOptions.getProtocols(1);
    const want = [
        'aaveV2',
        'aaveV3',
        'aura',
        'beefy',
        'compoundV2',
        'compoundV3',
        'curve',
        'idleJunior',
        'idleSenior',
        'origin',
        'yearn',
        'balancer',
        'flux',
        'convex',
    ];
    expect(result.map(protocol => protocol.key)).toEqual(want);
});

describe.concurrent("getAssets()", () => {
    test("should return a list of unique assets", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        const result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);
    });

    test("should use cached values if available", async () => {
        const protocolData = {
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },

        };
        const mockLiveProvider = new MockLiveProvider(protocolData);
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        let result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);

        // we add another address that shouldn't be included in the cached response
        protocolData[1].aaveV2["0x6B175474E89094C44Da98b954EedeAC495271d0F"] = 11;
        mockLiveProvider.setData(protocolData);

        result = await yieldOptions.getAssets(1);
        expect(result).toEqual([
            "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        ]);
    });
});

describe.concurrent("getProtocolAssets()", () => {
    test("should return a list of unique assets", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        const result = await yieldOptions.getProtocolAssets(1, "aaveV2");
        expect(result).toEqual([
            "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        ]);
    });
})

describe.concurrent("getProtocolsByAsset()", () => {
    test("should return a list of unique protocols", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "aaveV3": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 2,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        const result = await yieldOptions.getProtocolsByAsset(1, "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff");
        expect(result.map(protocol => protocol.key)).toEqual([
            "aaveV2",
            "aaveV3"
        ]);
    });
})

describe.concurrent("getYieldOptionsByProtocol", () => {
    test("should return a list of assets and their apys for a given protocol", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        const result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                asset: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", apy: 12 }] }
            },
            {
                asset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", apy: 10 }] }
            }
        ]);
    });

    test("should return the cached value if available", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        let result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                asset: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", apy: 12 }] }
            },
            {
                asset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", apy: 10 }] }
            }
        ]);

        mockLiveProvider.setAsset(1, "aaveV2", "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", 15);
        result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                asset: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", apy: 12 }] }
            },
            {
                asset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", apy: 10 }] }
            }
        ]);
    });

    test("should use cached APY data if available", async () => {
        const mockLiveProvider = new MockLiveProvider({
            1: {
                "aaveV2": {
                    "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff": 12,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
                "idleJunior": {
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 11,
                    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 10,
                },
            },
        });
        const yieldOptions = new YieldOptions(mockLiveProvider, 360_000);
        const apy = await yieldOptions.getApy(1, "aaveV2", "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff");
        expect(apy).toEqual({
            total: 12,
            apy: [{
                apy: 12,
                rewardToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
            }],
        });

        mockLiveProvider.setAsset(1, "aaveV2", "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", 15);

        let result = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
        expect(result).toEqual([
            {
                asset: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff',
                yield: { total: 12, apy: [{ rewardToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff", apy: 12 }] }
            },
            {
                asset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                yield: { total: 10, apy: [{ rewardToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", apy: 10 }] }
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