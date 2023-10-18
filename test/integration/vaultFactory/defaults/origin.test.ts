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
    const result = await origin({ client: publicClient, address: "0xDcEe70654261AF21C44c093C300eD3Bb97b78192" }); // OETH

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("oToken");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("oToken");
    expect(result.default[0].value).toBe("0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3");
  });
});