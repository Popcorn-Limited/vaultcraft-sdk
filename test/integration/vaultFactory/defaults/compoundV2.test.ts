import { describe, test, expect, beforeAll } from "vitest";

import { compoundV2 } from "../../../../src/vaultFactory/strategyDefaults/resolver/compoundV2.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("compoundV2() should return correct params and defaults", async () => {
    const result = await compoundV2({ client: publicClient, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" }); // Dai

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("cToken");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("cToken");
    expect(result.default[0].value).toBe("0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643");
  });
});