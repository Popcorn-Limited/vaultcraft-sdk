import { describe, test, expect, beforeAll } from "vitest";

import { alpacaV1 } from "../../../../src/vaultFactory/strategyDefaults/resolver/alpacaV1.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.skip("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("alpacaV1() should return correct params and defaults", async () => {
    const result = await alpacaV1({ client: publicClient, address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" }); // BNB

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("alpacaVault");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("alpacaVault");
    expect(result.default[0].value).toBe("0xd7D069493685A581d27824Fc46EdA46B7EfC0063");
  });
});