import { describe, test, expect, beforeAll } from "vitest";

import { beefy } from "../../../../src/vaultFactory/strategyDefaults/resolver/beefy.js";
import { publicClient } from "../../../setup.js";
import { zeroAddress } from "viem";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("beefy() should return correct params and defaults", async () => {
    const result = await beefy({ client: publicClient, address: "0x20a61B948E33879ce7F23e535CC7BAA3BC66c5a9" }); // R/DAI

    // Test params
    expect(result.params.length).toBe(2);
    expect(result.params[0].name).toBe("beefyVault");
    expect(result.params[0].type).toBe("address");
    expect(result.params[1].name).toBe("beefyBooster");
    expect(result.params[1].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(2);
    expect(result.default[0].name).toBe("beefyVault");
    expect(result.default[0].value).toBe("0xBE2bD093B8F342e060E79Fad6059B1057F016Ba4");
    expect(result.default[1].name).toBe("beefyBooster");
    expect(result.default[1].value).toBe(zeroAddress);
  });
});