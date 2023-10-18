import { describe, test, expect, beforeAll } from "vitest";

import { flux } from "../../../../src/vaultFactory/strategyDefaults/resolver/flux.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("flux() should return correct params and defaults", async () => {
    const result = await flux({ client: publicClient, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" }); // Dai

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("fToken");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("fToken");
    expect(result.default[0].value).toBe("0xe2bA8693cE7474900A045757fe0efCa900F6530b");
  });
});