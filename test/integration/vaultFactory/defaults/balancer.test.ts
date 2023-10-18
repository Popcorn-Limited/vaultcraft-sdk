import { describe, test, expect, beforeAll } from "vitest";

import { balancer } from "../../../../src/vaultFactory/strategyDefaults/resolver/balancer.js";
import { publicClient } from "../../../setup.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("balancer() should return correct params and defaults", async () => {
    const result = await balancer({ client: publicClient, address: "0x423a1323c871abc9d89eb06855bf5347048fc4a5" }); // 4pool

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("gauge");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("gauge");
    expect(result.default[0].value).toBe("0xa14453084318277b11d38fbe05d857a4f647442b");
  });
});