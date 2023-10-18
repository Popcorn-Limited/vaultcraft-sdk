import { describe, test, expect, beforeAll } from "vitest";

import { curve } from "../../../../src/vaultFactory/strategyDefaults/resolver/curve.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("curve() should return correct params and defaults", async () => {
    const result = await curve({ client: publicClient, address: "0xf43211935c781d5ca1a41d2041f397b8a7366c7a" }); // eth/frxETH

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("poolId");
    expect(result.params[0].type).toBe("uint256");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("poolId");
    expect(result.default[0].value).toBe(172);
  });
});