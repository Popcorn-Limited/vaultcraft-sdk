import { Address, PublicClient, WriteContractParameters } from "viem";

import { VaultControllerABI } from "./abi/VaultControllerABI";
import { Base } from "./base";
import { VaultFees } from "./vault";

const ABI = VaultControllerABI;

export class VaultController extends Base {
    private baseObj;

    constructor(address: Address, publicClient: PublicClient) {
        super(address, publicClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    getProposeVaultAdaptersReq(account: Address, vaults: Address[], adapters: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "proposeVaultAdapters",
            args: [vaults, adapters],
        };
    }

    getChangeVaultAdaptersReq(account: Address, vaults: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "changeVaultAdapters",
            args: [vaults],
        };
    }

    getProposeVaultFeesReq(account: Address, vaults: Address[], fees: VaultFees[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "proposeVaultFees",
            args: [vaults, fees],
        };
    }

    getChangeVaultFeesReq(account: Address, vaults: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "changeVaultFees",
            args: [vaults],
        };
    }

    getSetVaultQuitPeriodsReq(account: Address, vaults: Address[], quitPeriods: BigInt[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setVaultQuitPeriods",
            args: [vaults, quitPeriods],
        };
    }

    getSetVaultFeeRecipientsReq(account: Address, vaults: Address[], recipients: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setVaultFeeRecipients",
            args: [vaults, recipients],
        };
    }

    getPauseVaultsReq(account: Address, vaults: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "pauseVaults",
            args: [vaults],
        };
    }

    getUnpauseVaultsReq(account: Address, vaults: Address[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "unpauseVaults",
            args: [vaults],
        };
    }

    getSetVaultDepositLimits(account: Address, vaults: Address[], limits: BigInt[]): WriteContractParameters {
        return {
            ...this.baseObj,
            account,
            functionName: "setVaultDepositLimits",
            args: [vaults, limits],
        };
    }
}