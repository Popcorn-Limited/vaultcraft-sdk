import { describe, test, expect, beforeAll } from "vitest";

import { compoundV3 } from "../../../../src/vaultFactory/strategyDefaults/resolver/compoundV3.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("compoundV3() should return correct params and defaults", async () => {
    const result = await compoundV3({ client: publicClient, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }); // USDC

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("cToken");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("cToken");
    expect(result.default[0].value).toBe("0xc3d688B66703497DAA19211EEdff47f25384cdc3");
  });
});