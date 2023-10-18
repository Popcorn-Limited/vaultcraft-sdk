import { describe, test, expect, beforeAll } from "vitest";

import { aura } from "../../../../src/vaultFactory/strategyDefaults/resolver/aura.js";
import { publicClient } from "../../../setup.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("aura() should return correct params and defaults", async () => {
    const result = await aura({ client: publicClient, address: "0x423a1323c871abc9d89eb06855bf5347048fc4a5" }); // 4pool

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("poolId");
    expect(result.params[0].type).toBe("uint256");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("poolId");
    expect(result.default[0].value).toBe(28);
  });
});