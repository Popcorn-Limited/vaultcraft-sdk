import { describe, test, expect, beforeAll } from "vitest";

import { curveChild } from "../../../../src/vaultFactory/strategyDefaults/resolver/curveChild.js";
import { publicClient } from "../../../setup.js";


const FORK_BLOCK_NUMBER = BigInt(18071114);

describe.concurrent("read-only", () => {
  beforeAll(async () => {
    await publicClient.reset({
      blockNumber: FORK_BLOCK_NUMBER,
    });
  });

  test("curveChild() should return correct params and defaults", async () => {
    const result = await curveChild({ client: publicClient, address: "0xf43211935c781d5ca1a41d2041f397b8a7366c7a" }); // eth/frxETH -- asset doesnt matter here

    // Test params
    expect(result.params.length).toBe(1);
    expect(result.params[0].name).toBe("crv");
    expect(result.params[0].type).toBe("address");

    // Test defaults
    expect(result.default.length).toBe(1);
    expect(result.default[0].name).toBe("crv");
    expect(result.default[0].value).toBe("0xD533a949740bb3306d119CC777fa900bA034cd52");
  });
});