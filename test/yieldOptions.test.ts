import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import { zeroAddress, decodeFunctionData } from "viem";

import { publicClient, walletClient } from "./setup";
import { ERC20ABI } from "./abis/erc20ABI";
import { YieldOptions } from "../src/yieldOptions";
import { IVaultABI } from "../src/abi/IVaultABI";
import { assert } from "console";

let yieldOptions = new YieldOptions([`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`]);

test("setup network", async () => {
    const success = await yieldOptions.setupNetwork(1)
    expect(success).toBe(true);
});

