import { describe, test, expect, beforeAll } from "vitest";

import { CompoundV2 } from "../../../../src/yieldOptions/providers/protocols/compoundv2.js";
import { Clients } from "../../../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../../../setup.js";

const clients: Clients = {
    1: publicClient,
};
const FORK_BLOCK_NUMBER = BigInt(18071114);
const compoundV2 = new CompoundV2(clients);

describe.concurrent("read-only", () => {
    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAssets() should return all the available assets", async () => {
        const result = await compoundV2.getAssets(1);
        const want = [
            '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
            '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
            '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
            '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
            '0x0000000000085d4780B73119b644AE5ecd22b376',
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
        ];
        expect(result).toEqual(want);
    });

    test("getApy() should return the APY for a given asset", async () => {
        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const result = await compoundV2.getApy(1, usdc);
        expect(result.total).toBe(3.1817536120094303);
    });
});