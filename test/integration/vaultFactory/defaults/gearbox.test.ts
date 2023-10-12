import { describe, test, expect, beforeAll } from "vitest";

import { publicClient } from "../../../setup.js";
import { gearbox } from "../../../../src/vaultFactory/strategyDefaults/resolver/gearbox.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("gearbox() should return correct params and defaults", async () => {
    const result = await gearbox({ client: publicClient, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" }); // DAI

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("poolId");
    expect(result.params[0].type).toBe("uint256");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("poolId");
    expect(result.default[0].value).toBe(12);
  });
});