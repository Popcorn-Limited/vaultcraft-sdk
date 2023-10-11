import { describe, test, expect, beforeAll } from "vitest";

import { origin } from "../../../../src/vaultFactory/strategyDefaults/resolver/origin.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("origin() should return correct params and defaults", async () => {
    const result = await origin({ client: publicClient, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" }); // Dai

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("cdo");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("cdo");
    expect(result.default[0].value).toBe("0x5dcA0B3Ed7594A6613c1A2acd367d56E1f74F92D");
  });
});