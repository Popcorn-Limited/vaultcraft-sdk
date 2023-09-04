import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import { zeroAddress, decodeFunctionData } from "viem";

import { publicClient, walletClient } from "./setup";
import { ERC20ABI } from "./abis/erc20ABI";
import { YieldOptions } from "../src/yieldOptions";
import { IVaultABI } from "../src/abi/IVaultABI";
import { assert } from "console";

let yieldOptions = new YieldOptions({ 1: `https://eth-mainnet.alchemyapi.io/v2/KsuP431uPWKR3KFb-K_0MT1jcwpUnjAg` });
describe.concurrent("read-only", () => {

    // beforeAll(async () => {
    //     yieldOptions
    // });

    test("setup network", async () => {
        const success = await yieldOptions.setupNetwork(1)
        expect(success).toBe(true);
    },60_000);

})