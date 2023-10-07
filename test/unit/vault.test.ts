import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import { zeroAddress, decodeFunctionData } from "viem";

import { publicClient, walletClient } from "../setup";
import { ERC20ABI } from "../abis/erc20ABI";
import { Vault } from "../../src/vault";
import { IVaultABI } from "../../src/abi/IVaultABI";

let vault = new Vault("0x5d344226578DC100b2001DA251A4b154df58194f", publicClient, walletClient);
const FORK_BLOCK_NUMBER = BigInt(1296974);
// some random address that has a lot of ETH & DAI
const USER_ADDRESS = "0x6FF8E4DB500cBd77d1D181B8908E022E29e0Ec4A";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe.concurrent("read-only", () => {

    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    // ERC-20 VIEWS

    test("name() should return correct value", async () => {
        const name = await vault.name();
        expect(name).toBe("Popcorn Dai Stablecoin Vault");
    });

    test("symbol() should return correct value", async () => {
        const name = await vault.symbol();
        expect(name).toBe("pop-DAI");
    });

    test("decimals() should return correct value", async () => {
        const name = await vault.decimals();
        expect(name).toBe(27);
    });

    test("allowance() should return correct value", async () => {
        const allowance = await vault.allowance("0x22f5413C075Ccd56D575A54763831C4c27A37Bdb", "0xF2F02200aEd0028fbB9F183420D3fE6dFd2d3EcD");

        expect(allowance).toBe(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));
    });

    test("balanceOf() should return correct value", async () => {
        const balance = await vault.balanceOf("0xE92cbe5be7631557bF990d7Ff38277047561191f");

        expect(balance).toBe(BigInt("503522135781959529191541975218"));
    });

    // ERC-4626 GENERAL VIEWS

    test("totalAssets() should return correct value", async () => {
        const supply = await vault.totalAssets();

        expect(supply).toBe(BigInt("618196403043386757328"));
    });

    test("totalSupply() should return correct value", async () => {
        const supply = await vault.totalSupply();

        expect(supply).toBe(BigInt("611278748027269004853112758860"));
    });

    test("asset() should return correct value", async () => {
        const asset = await vault.asset();
        expect(asset).toBe("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    });

    // ERC-4626 CONVERSION VIEWS

    test("convertToShares() should return correct value", async () => {
        const shares = await vault.convertToShares(BigInt(1e18));
        expect(shares).toBe(BigInt("988809939718086240555270640"));
    });

    test("convertToAssets() should return correct value", async () => {
        const amount = await vault.convertToAssets(BigInt(1e18));
        expect(amount).toBe(BigInt("1011316694"));
    });

    // ERC-4626 MAX VIEWS

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

    // ERC-4626 PREVIEW VIEWS

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

    // VAULT ADAPTER VIEWS

    test("adapter() should return correct value", async () => {
        const adapter = await vault.adapter();
        expect(adapter).toBe("0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc");
    });

    test("proposedAdapter() should return correct value", async () => {
        const address = await vault.proposedAdapter();
        expect(address).toBe(zeroAddress);
    });

    test("proposedAdapterTime() should return correct value", async () => {
        const time = await vault.proposedAdapterTime();
        expect(time).toBe(BigInt(0));
    });

    // VAULT FEE VIEWS

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
        const time = await vault.feesUpdatedAt();
        expect(time).toBe(BigInt("1687792391"));
    });

    test("feeRecipient() should return correct value", async () => {
        const recipient = await vault.feeRecipient();
        expect(recipient).toBe("0x74bb390786072ea1329f270CA6C0058b2D1Afe3f");
    });

    // VAULT OTHER VIEWS

    test("quitPeriod() should return correct value", async () => {
        const time = await vault.quitPeriod();
        expect(time).toBe(BigInt(86400));
    });

    test("depositLimit() should return correct value", async () => {
        const amount = await vault.depositLimit();
        expect(amount).toBe(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));
    });
});

describe("write-only", () => {
    beforeEach(async () => {
        // TODO: is revert() faster?
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });

        await walletClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });

        // public client has to impersonate as well because of the simulation request
        await publicClient.impersonateAccount({
            address: USER_ADDRESS,
        });
        await walletClient.impersonateAccount({
            address: USER_ADDRESS,
        });
    });

    // ERC-20 WRITES

    test("approve() should approve vault shares for another spender", async () => {
        // Get Vault Shares
        await approve(BigInt(1e18));
        await vault.mint(BigInt(1e18), USER_ADDRESS, { account: USER_ADDRESS });
        const spender = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

        // Actual Test

        const hash = await vault.approve(spender, BigInt(1e18), { account: USER_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(USER_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("approve");
        expect(args).toEqual([spender, BigInt(1e18)]);
    });

    test("transfer() should transfer vault shares to another address", async () => {
        // Get Vault Shares
        await approve(BigInt(1e18));
        await vault.mint(BigInt(1e18), USER_ADDRESS, { account: USER_ADDRESS });
        const recipient = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

        const hash = await vault.transfer(recipient, BigInt(1e18), { account: USER_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(USER_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("transfer");
        expect(args).toEqual([recipient, BigInt(1e18)]);
    });

    // ERC-4626 WRITES

    test("deposit() should deposit funds into the vault", async () => {
        await approve(BigInt(1e18));

        const hash = await vault.deposit(BigInt(1e18), USER_ADDRESS, { account: USER_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(USER_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("deposit");
        expect(args).toEqual([BigInt(1e18), USER_ADDRESS]);
    });

    test("mint() should mint vault shares", async () => {
        await approve(BigInt(1e18));

        const hash = await vault.mint(BigInt(1e18), USER_ADDRESS, { account: USER_ADDRESS });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(USER_ADDRESS.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("mint");
        expect(args).toEqual([BigInt(1e18), USER_ADDRESS]);
    });

    test("withdraw() should withdraw from vault", async () => {
        // user holds vault shares already
        const user = "0xE92cbe5be7631557bF990d7Ff38277047561191f";
        // user doesn't have enough ETH for the tx so we add them for the test
        await publicClient.setBalance({ address: user, value: BigInt(1e18) });
        await publicClient.impersonateAccount({
            address: user,
        });
        const hash = await vault.withdraw(BigInt(1e18), user, user, { account: user });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(user.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("withdraw");
        expect(args).toEqual([BigInt(1e18), user, user]);
    });

    test("redeem() should redeem vault shares", async () => {
        // user holds vault shares already
        const user = "0xE92cbe5be7631557bF990d7Ff38277047561191f";
        // user doesn't have enough ETH for the tx so we add them for the test
        await publicClient.setBalance({ address: user, value: BigInt(1e18) });
        await publicClient.impersonateAccount({
            address: user,
        });
        const hash = await vault.redeem(BigInt(1e18), user, user, { account: user });
        const tx = await publicClient.getTransaction({
            hash,
        });

        const { functionName, args } = decodeFunctionData({
            abi: IVaultABI,
            data: tx.input,
        });

        expect(tx.from).toBe(user.toLowerCase());
        expect(tx.to).toBe(vault.address.toLowerCase());
        expect(functionName).toBe("redeem");
        expect(args).toEqual([BigInt(1e18), user, user]);
    });
}, 10_000);

function approve(amount: bigint) {
    return walletClient.writeContract({
        account: USER_ADDRESS,
        address: DAI_ADDRESS,
        abi: ERC20ABI,
        functionName: "approve",
        args: [vault.address, amount],
    });
}