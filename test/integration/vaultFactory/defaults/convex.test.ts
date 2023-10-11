import { describe, test, expect, beforeAll } from "vitest";

import { convex } from "../../../../src/vaultFactory/strategyDefaults/resolver/convex.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("convex() should return correct params and defaults", async () => {
    const result = await convex({ client: publicClient, address: "0x596b330fA8AB2b449973309af6D6ddc002CaA52D" }); // WACME/frxETH

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