import { describe, test, expect, beforeAll } from "vitest";

import { publicClient } from "../../../setup.js";
import { curveCompounder } from "../../../../src/vaultFactory/strategyDefaults/resolver/curveCompounder.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("curveCompounder() should return correct params and defaults", async () => {
    const result = await curveCompounder({ client: publicClient, address: "0x3175df0976dfa876431c2e9ee6bc45b65d3473cc" }); // crvFrax

    // Test params
    expect(result.params.length).toBe(5);
    expect(result.params[0].name).toBe("poolId");
    expect(result.params[0].type).toBe("uint256");
    expect(result.params[1].name).toBe("rewardTokens");
    expect(result.params[1].type).toBe("uint256[]");
    expect(result.params[2].name).toBe("minTradeAmounts");
    expect(result.params[2].type).toBe("uint256[]");
    expect(result.params[3].name).toBe("baseAsset");
    expect(result.params[3].type).toBe("address");
    expect(result.params[4].name).toBe("optionalData");
    expect(result.params[4].type).toBe("bytes");

    // Test defaults
    expect(result.default.length).toBe(5);
    expect(result.default[0].name).toBe("poolId");
    expect(result.default[0].value).toBe(162);
    expect(result.default[1].name).toBe("rewardTokens");
    expect(result.default[1].value).toBe(["0xD533a949740bb3306d119CC777fa900bA034cd52"]);
    expect(result.default[2].name).toBe("minTradeAmounts");
    expect(result.default[2].value).toBe([BigInt(0)]);
    expect(result.default[3].name).toBe("baseAsset");
    expect(result.default[3].value).toBe("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    expect(result.default[4].name).toBe("optionalData");
    expect(result.default[4].value).toBe(["0x"]);
  });
});