import { describe, test, expect, beforeAll } from "vitest";

import { client } from "./setup";

import { VaultControllerABI } from "../src/abi/VaultControllerABI";
import { VaultController } from "../src/vaultController";


let controller: VaultController;

beforeAll(async () => {
    await client.reset({
        blockNumber: BigInt(17883751),
    });

    controller = new VaultController("0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb", client);
});

describe.concurrent("VaultController tests", () => {
    test("getProposeVaultAdaptersReq() should return correct object", () => {
        const req = controller.getProposeVaultAdaptersReq("0x1", ["0x2"], ["0x3"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "proposeVaultAdapters",
            abi: VaultControllerABI,
            args: [["0x2"], ["0x3"]],
        });
    });

    test("getChangeVaultAdaptersReq() should return correct object", () => {
        const req = controller.getChangeVaultAdaptersReq("0x1", ["0x2"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "changeVaultAdapters",
            abi: VaultControllerABI,
            args: [["0x2"]],
        });
    });

    test("getProposeVaultFeesReq() should return correct object", () => {
        const fees = {
            deposit: BigInt(0),
            withdrawal: BigInt(0),
            management: BigInt(0),
            performance: BigInt(100),
        };
        const req = controller.getProposeVaultFeesReq("0x1", ["0x2"], [fees]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "proposeVaultFees",
            abi: VaultControllerABI,
            args: [["0x2"], [fees]],
        });
    });

    test("getChangeVaultFeesReq() should return correct object", () => {
        const req = controller.getChangeVaultFeesReq("0x1", ["0x2"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "changeVaultFees",
            abi: VaultControllerABI,
            args: [["0x2"]],
        });
    });

    test("getSetVaultQuitPeriodsReq() should return correct object", () => {
        const req = controller.getSetVaultQuitPeriodsReq("0x1", ["0x2"], [BigInt(3600)]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "setVaultQuitPeriods",
            abi: VaultControllerABI,
            args: [["0x2"], [BigInt(3600)]]
        });
    });

    test("getSetVaultFeeRecipientsReq() should return correct object", () => {
        const req = controller.getSetVaultFeeRecipientsReq("0x1", ["0x2"], ["0x1"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "setVaultFeeRecipients",
            abi: VaultControllerABI,
            args: [["0x2"], ["0x1"]]
        });
    });

    test("getPauseVaultsReq() should return correct object", () => {
        const req = controller.getPauseVaultsReq("0x1", ["0x2"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "pauseVaults",
            abi: VaultControllerABI,
            args: [["0x2"]],
        });
    });

    test("getUnpauseVaultsReq() should return correct object", () => {
        const req = controller.getUnpauseVaultsReq("0x1", ["0x2"]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "unpauseVaults",
            abi: VaultControllerABI,
            args: [["0x2"]],
        });
    });

    test("getSetVaultDepositLimits() should return correct object", () => {
        const req = controller.getSetVaultDepositLimits("0x1", ["0x2"], [BigInt(3600)]);

        expect(req).toEqual({
            account: "0x1",
            address: controller.address,
            functionName: "setVaultDepositLimits",
            abi: VaultControllerABI,
            args: [["0x2"], [BigInt(3600)]]
        });
    });
});