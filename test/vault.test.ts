import { describe, test, expect } from "vitest";

import { client } from "./setup";

import { Vault } from "../src/vault";
import { IVaultABI } from "../src/abi/IVault";

let vault = new Vault("0x5d344226578DC100b2001DA251A4b154df58194f", client);

describe.concurrent("Vault tests", () => {
    test("getDepositReq() should return correct object", () => {
        const req = vault.getDepositReq("0x1", BigInt(100), "0x2");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "deposit",
            abi: IVaultABI,
            args: [BigInt(100), "0x2"],
        });
    });

    test("getMintReq() should return correct object", () => {
        const req = vault.getMintReq("0x1", BigInt(100), "0x2");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "mint",
            abi: IVaultABI,
            args: [BigInt(100), "0x2"],
        });
    });

    test("getWithdrawReq() should return correct object", () => {
        const req = vault.getWithdrawReq("0x1", BigInt(100), "0x2", "0x3");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "withdraw",
            abi: IVaultABI,
            args: [BigInt(100), "0x2", "0x3"],
        });
    });

    test("getRedeemReq() should return correct object", () => {
        const req = vault.getRedeemReq("0x1", BigInt(100), "0x2", "0x3");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "redeem",
            abi: IVaultABI,
            args: [BigInt(100), "0x2", "0x3"],
        });
    });

    test("totalSupply() should return correct value", async () => {
        const supply = await vault.totalSupply();

        expect(supply).toBe(BigInt("611278748027269004853112758860"));
    });

    test("totalAssets() should return correct value", async () => {
        const supply = await vault.totalAssets();

        expect(supply).toBe(BigInt("618196403043386757328"));
    });

    test("balanceOf() should return correct value", async () => {
        const balance = await vault.balanceOf("0xE92cbe5be7631557bF990d7Ff38277047561191f");

        expect(balance).toBe(BigInt("503522135781959529191541975218"));
    });

    test("adapter() should return correct value", async () => {
        const adapter = await vault.adapter();
        expect(adapter).toBe("0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc");
    });
});
