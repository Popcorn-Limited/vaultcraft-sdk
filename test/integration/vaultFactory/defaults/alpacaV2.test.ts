import { describe, test, expect, beforeAll } from "vitest";

import { alpacaV2 } from "../../../../src/vaultFactory/strategyDefaults/resolver/alpacaV2.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.skip("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("alpacaV2() should return correct params and defaults", async () => {
    const result = await alpacaV2({ client: publicClient, address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" }); // BNB

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("alpacaVault");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("alpacaVault");
    expect(result.default[0].value).toBe("0x2928623eFF453Fb8C9BC744041637a4D2D5Fc56b");
  });
});