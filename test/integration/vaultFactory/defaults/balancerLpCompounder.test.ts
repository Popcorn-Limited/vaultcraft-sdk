import { describe, test, expect, beforeAll } from "vitest";

import { publicClient } from "../../../setup.js";
import { balancerLpCompounder } from "../../../../src/vaultFactory/strategyDefaults/resolver/balancerLpCompounder.js";

const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("balancerLpCompounder() should return correct params and defaults", async () => {
    const result = await balancerLpCompounder({ client: publicClient, address: "0x20a61B948E33879ce7F23e535CC7BAA3BC66c5a9" }); // R/DAI

    // Test params
    expect(result.params.length).toBe(5);
    expect(result.params[0].name).toBe("gauge");
    expect(result.params[0].type).toBe("address");
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
    expect(result.default[0].name).toBe("gauge");
    expect(result.default[0].value).toBe("0x0EDF6cDd81BC3471C053341B7D8Dfd1Cb367AD93");
    expect(result.default[1].name).toBe("rewardTokens");
    expect(result.default[1].value).toBe(["0xba100000625a3754423978a60c9317c58a424e3D"]);
    expect(result.default[2].name).toBe("minTradeAmounts");
    expect(result.default[2].value).toBe([BigInt(0)]);
    expect(result.default[3].name).toBe("baseAsset");
    expect(result.default[3].value).toBe("0x183015a9bA6fF60230fdEaDc3F43b3D788b13e21");
    expect(result.default[4].name).toBe("optionalData");
    expect(result.default[4].value).toBe(["0x20a61b948e33879ce7f23e535cc7baa3bc66c5a9000000000000000000000555", 0]);
  });
});