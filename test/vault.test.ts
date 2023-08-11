import { describe, test, expect } from "vitest";

import { client } from "./setup";

import { Vault } from "../src/vault";
import { IVaultABI } from "../src/abi/IVault";
import { zeroAddress } from "viem";

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

    test("asset() should return correct value", async () => {
        const asset = await vault.asset();
        expect(asset).toBe("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    });

    test("convertToShares() should return correct value", async () => {
        const shares = await vault.convertToShares(BigInt(1e18));
        expect(shares).toBe(BigInt("988809939718086240555270640"));
    });

    test("convertToAssets() should return correct value", async () => {
        const amount = await vault.convertToAssets(BigInt(1e18));
        expect(amount).toBe(BigInt("1011316694"));
    });

    test("maxDeposit() should return correct value", async () => {
        const max = await vault.maxDeposit("0xE92cbe5be7631557bF990d7Ff38277047561191f");
        expect(max).toBe(BigInt("115792089237316195423570985008687907853269984665640564038839387604869742882607"));
    });

    test("maxMint() should return correct value", async () => {
        const max = await vault.maxMint("0xE92cbe5be7631557bF990d7Ff38277047561191f");
        expect(max).toBe(BigInt("115792089237316195423570985008687907853269984665640564038839387604869742882607"));
    });

    test("maxWithdraw() should return correct value", async () => {
        const max = await vault.maxWithdraw("0xE92cbe5be7631557bF990d7Ff38277047561191f");
        expect(max).toBe(BigInt("618196403043386757328"));
    });

    test("maxRedeem() should return correct value", async () => {
        const max = await vault.maxRedeem("0xE92cbe5be7631557bF990d7Ff38277047561191f");
        expect(max).toBe(BigInt("611886095865436391103142342086"));
    });

    test("previewDeposit() should return correct value", async () => {
        const shares = await vault.previewDeposit(BigInt(1e18));
        expect(shares).toBe(BigInt("989792390983052207810209752"));
    });

    test("previewMint() should return correct value", async () => {
        const amount = await vault.previewMint(BigInt(1e18));
        expect(amount).toBe(BigInt("1010312879"));
    });

    test("previewWithdraw() should return correct value", async () => {
        const shares = await vault.previewWithdraw(BigInt(1e18));
        expect(shares).toBe(BigInt("989792390983052207810209753"));
    });

    test("previewRedeem() should return correct value", async () => {
        const amount = await vault.previewMint(BigInt(1e18));
        expect(amount).toBe(BigInt("1010312879"));
    });

    test("proposedAdapter() should return correct value", async () => {
        const address = await vault.proposedAdapter();
        expect(address).toBe(zeroAddress);
    });

    test("proposedAdapterTime() should return correct value", async () => {
        const time = await vault.proposedAdapterTime();
        expect(time).toBe(BigInt(0));
    });

    test("getProposeAdapterReq() should return correct object", () => {
        const req = vault.getProposeAdapterReq("0x1", "0x2");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "proposeAdapter",
            abi: IVaultABI,
            args: ["0x2"],
        });
    });

    test("changeAdapter() should return correct object", () => {
        const req = vault.getChangeAdapterReq("0x1");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "changeAdapter",
            abi: IVaultABI,
        });
    });

    test("fees() should return correct value", async () => {
        const expected = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            management: BigInt(0),
            performance: BigInt(100000000000000000),
        };
        const fees = await vault.fees();
        expect(fees).toEqual(expected);
    });

    test("proposedFees() should return correct value", async () => {
        const expected = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            management: BigInt(0),
            performance: BigInt(0),
        };
        const fees = await vault.proposedFees();
        expect(fees).toEqual(expected);
    });

    test("proposedFeeTime() should return correct value", async () => {
        const time = await vault.proposedFeeTime();
        expect(time).toBe(BigInt(0));
    });

    test("getProposeFeesReq() should return correct value", async () => {
        const fees = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            management: BigInt(0),
            performance: BigInt(0),
        };
        const req = vault.getProposeFeesReq("0x1", fees);
        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "proposeFees",
            abi: IVaultABI,
            args: [fees],
        });
    });

    test("getChangeFeesReq() should return correct object", () => {
        const req = vault.getChangeFeesReq("0x1");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "changeFees",
            abi: IVaultABI,
        });
    });

    test("getSetFeeRecipientReq() should return correct object", () => {
        const req = vault.getSetFeeRecipientReq("0x1", "0x2");

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "setFeeRecipient",
            abi: IVaultABI,
            args: ["0x2"],
        });
    });

    test("quitPeriod() should return correct value", async () => {
        const time = await vault.quitPeriod();
        expect(time).toBe(BigInt(86400));
    });

    test("getSetQuitPeriodReq() should return correct object", () => {
        const req = vault.getSetQuitPeriodReq("0x1", BigInt(1));

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "setQuitPeriod",
            abi: IVaultABI,
            args: [BigInt(1)],
        });
    });

    test("depositLimit() should return correct value", async () => {
        const amount = await vault.depositLimit();
        expect(amount).toBe(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));
    });

    test("getSetDepositLimitReq() should return correct object", () => {
        const req = vault.getSetDepositLimitReq("0x1", BigInt(1));

        expect(req).toEqual({
            account: "0x1",
            address: vault.address,
            functionName: "setDepositLimit",
            abi: IVaultABI,
            args: [BigInt(1)],
        });
    });

    test("accruedManagementFee() should return correct value", async () => {
        const amount = await vault.accruedManagementFee();
        expect(amount).toBe(BigInt(0));
    });

    test("accruedPerformanceFee() should return correct value", async () => {
        const amount = await vault.accruedPerformanceFee();
        expect(amount).toBe(BigInt("292378476237555336"));
    });

    test("highWaterMark() should return correct value", async () => {
        const amount = await vault.highWaterMark();
        expect(amount).toBe(BigInt("1006533631"));
    });

    test("feesUpdatedAt() should return correct value", async () => {
        const time = await vault.feeUpdatedAt();
        expect(time).toBe(BigInt("1687792391"));
    });

    test("feeRecipient() should return correct value", async () => {
        const recipient = await vault.feeRecipient();
        expect(recipient).toBe("0x74bb390786072ea1329f270CA6C0058b2D1Afe3f");
    });
});
