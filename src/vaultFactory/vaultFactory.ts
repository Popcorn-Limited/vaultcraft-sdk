import { Hash, Address, PublicClient, WalletClient, Transport, Chain, maxUint256, pad, zeroAddress, getAddress, stringToHex, parseAbiParameters, encodeAbiParameters } from "viem";

import { VaultControllerABI } from "../abi/VaultControllerABI.js";
import { Base } from "../base.js";
import type { VaultFees, WriteOptions } from "../types.js";
import { EMPTY_BYTES } from "../lib/constants/index.js";
import { resolveStrategyDefaults } from "./strategyDefaults/strategyDefaults.js";
import { StrategyDefault } from "./strategyDefaults/index.js";
import strategies from "@/lib/constants/strategies.js";
import { resolveStrategyEncoding } from "./strategyEncoding/strategyDefaults.js";

const ABI = VaultControllerABI;

export type VaultOptions = {
    asset: Address;
    adapter: Address;
    fees: VaultFees;
    feeRecipient: Address;
    depositLimit?: bigint;
    owner: Address;
    staking: boolean;
    initialDeposit: bigint;
};

export type VaultMetadata = {
    metadataCID: string;
    swapTokenAddresses: [Address, Address, Address, Address, Address, Address, Address, Address];
    swapAddress: Address;
    exchange: bigint;
};

export type AdapterOptions = {
    asset: Address,
    adapterData: [Hash, Hash];
    strategyData: [Hash, Hash];
    initialDeposit: bigint;
}

type Data = {
    [chainId: number]: {
        [protocol: string]: {
            [asset: string]: Yield;
        };
    };
};

export class VaultFactory extends Base {
    private baseObj;

    constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain>) {
        super(address, publicClient, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    async getStrategyParams(chainId: number, strategy: string, asset: Address): Promise<StrategyDefault> {
        return resolveStrategyDefaults({
            chainId,
            client: this.publicClient,
            address: getAddress(asset),
            resolver: strategy
        })
    }

    async createVaultByKey(vault: VaultOptions, strategy: string, options: WriteOptions): Promise<Hash> {
        const params = await resolveStrategyDefaults({
            chainId,
            client: this.publicClient,
            address: getAddress(vault.asset),
            resolver: strategy
        })
    }

    private encodeAdapter(asset: Address, resolver: string): Promise<Hash> {
        const data = await resolveStrategyDefaults({
            chainId,
            client: this.publicClient,
            address: getAddress(asset),
            resolver
        })
        // TODO ERROR HANDLING
        // 1. if key === "error"
        // 2. if any value in data.default is null

        return encodeAbiParameters(data.params, data.default.map(v => v.value))

    }

    private encodeStrategy(asset: Address, resolver: string): Promise<Hash> {
        const data = await resolveStrategyDefaults({
            chainId,
            client: this.publicClient,
            address: getAddress(asset),
            resolver
        })
        // TODO ERROR HANDLING
        // 1. if key === "error"
        // 2. if any value in data.default is null

        return resolveStrategyEncoding({
            chainId,
            client: this.publicClient,
            address: getAddress(asset),
            params: data.default.map(v => v.value),
            resolver
        })

    }

    async createStrategyByKey(vault: VaultOptions, metadata: VaultMetadata, strategy: string, options: WriteOptions): Promise<Hash> {
        let adapterId = stringToHex("", { size: 32 })
        let adapterInitParams: Hash = "0x"

        let strategyId = stringToHex("", { size: 32 })
        let strategyInitParams: Hash = "0x"

        if (strategy.includes("Depositor")) {
            // Encode Adapter
            adapterId = stringToHex(strategies[strategy].key, { size: 32 })
            adapterInitParams = await this.encodeAdapter(vault.asset, strategies[strategy].resolver)
        } else {
            // Encode Adapter
            const adapter = strategies[strategies[strategy].adapter]
            adapterId = stringToHex((adapter.key as string), { size: 32 })
            adapterInitParams = await this.encodeAdapter(vault.asset, adapter.resolver)

            // Encode Strategy
            strategyId = stringToHex((strategies[strategy].key as string), { size: 32 })
            strategyInitParams = await this.encodeStrategy(vault.asset, strategies[strategy].resolver)
        }

        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deployVault",
            args: [
                {
                    asset: vault.asset,
                    adapter: vault.adapter,
                    fees: vault.fees,
                    feeRecipient: vault.feeRecipient,
                    depositLimit: vault.depositLimit ? vault.depositLimit : maxUint256 - BigInt(1),
                    owner: vault.owner,
                },
                { id: adapterId, data: adapterInitParams },
                { id: strategyId, data: strategyInitParams },
                false,
                EMPTY_BYTES, // reward data should be added in a separate step
                {
                    ...metadata,
                    // these three will be overriden by the VaultController. Specifying them here is pointless.
                    // But, we have to include them in the type so that viem doesn't throw an error
                    vault: zeroAddress,
                    staking: zeroAddress,
                    creator: zeroAddress,
                },
                vault.initialDeposit,
            ]
        });
    }

    async createVault(vault: VaultOptions, adapter: AdapterOptions, metadata: VaultMetadata, options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deployVault",
            args: [
                {
                    asset: vault.asset,
                    adapter: vault.adapter,
                    fees: vault.fees,
                    feeRecipient: vault.feeRecipient,
                    depositLimit: vault.depositLimit ? vault.depositLimit : maxUint256 - BigInt(1),
                    owner: vault.owner,
                },
                { id: adapter.adapterData[0], data: adapter.adapterData[1] },
                { id: adapter.strategyData[0], data: adapter.strategyData[1] },
                false,
                EMPTY_BYTES, // reward data should be added in a separate step
                {
                    ...metadata,
                    // these three will be overriden by the VaultController. Specifying them here is pointless.
                    // But, we have to include them in the type so that viem doesn't throw an error
                    vault: zeroAddress,
                    staking: zeroAddress,
                    creator: zeroAddress,
                },
                vault.initialDeposit,
            ]
        });
        return this.walletClient.writeContract(request);
    }

    async createVaultWithPredeployedStrategy(vault: VaultOptions, metadata: VaultMetadata, options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deployVault",
            args: [
                {
                    asset: vault.asset,
                    adapter: vault.adapter,
                    fees: vault.fees,
                    feeRecipient: vault.feeRecipient,
                    depositLimit: vault.depositLimit ? vault.depositLimit : maxUint256 - BigInt(1),
                    owner: vault.owner,
                },
                {
                    // we expect the adapter to be deployed already
                    id: pad("0x"),
                    data: "0x",
                },
                {
                    // we expect the strategy to be deployed already
                    id: pad("0x"),
                    data: "0x",
                },
                false,
                EMPTY_BYTES, // reward data should be added in a separate step
                {
                    ...metadata,
                    // these three will be overriden by the VaultController. Specifying them here is pointless.
                    // But, we have to include them in the type so that viem doesn't throw an error
                    vault: zeroAddress,
                    staking: zeroAddress,
                    creator: zeroAddress,
                },
                vault.initialDeposit,
            ]
        });
        return this.walletClient.writeContract(request);
    }

    async createStrategy(adapter: AdapterOptions, options: WriteOptions): Promise<Hash> {
        const { request } = await this.publicClient.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deployAdapter",
            args: [
                adapter.asset,
                { id: adapter.adapterData[0], data: adapter.adapterData[1] },
                { id: adapter.strategyData[0], data: adapter.strategyData[1] },
                adapter.initialDeposit
            ]
        });
        return this.walletClient.writeContract(request);
    }
}