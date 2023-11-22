import { Hash, Address, PublicClient, WalletClient, Transport, Chain, zeroAddress, getAddress, stringToHex, encodeAbiParameters } from "viem";

import { VaultControllerABI } from "../abi/VaultControllerABI.js";
import { Base } from "../base.js";
import type { VaultOptions, WriteOptions } from "../types.js";
import { EMPTY_BYTES } from "../lib/constants/index.js";
import { resolveStrategyDefaults } from "./strategyDefaults/strategyDefaults.js";
import strategies from "@/lib/constants/strategies.js";
import { resolveStrategyEncoding } from "./strategyEncoding/strategyEncoding.js";
import { SimulationResponse, StrategyData } from "./types.js";
import { StrategyDefault } from "./strategyDefaults/index.js";

const ABI = VaultControllerABI;

type BaseStrategyCreationParams = {
    asset: Address;
    initialDeposit: bigint;
}

type BaseVaultCreationParams = {
    vault: VaultOptions;
    metadataCID: string;
}

type StrategyParams = {
    adapterData: StrategyData;
    strategyData: StrategyData;
}

type BaseWriteParam = {
    options?: WriteOptions;
}

type CreateVaultParams = BaseVaultCreationParams & StrategyParams & BaseWriteParam

type CreateStrategyParams = BaseStrategyCreationParams & StrategyParams & BaseWriteParam

type CreateStrategyByKeyParams = BaseStrategyCreationParams & BaseWriteParam & { strategy: string }

type CreateVaultByKeyParams = BaseVaultCreationParams & BaseWriteParam & { strategy: string }


export class VaultFactory extends Base {
    private baseObj;
    private chainId;

    constructor({ address, publicClient, walletClient }: { address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain> }) {
        super(address, publicClient, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
        this.chainId = walletClient.chain.id;
    }

    private strategyDefaultsAreValid(data: StrategyDefault): boolean {
        return data.default.every(v => v.value !== null)
    }

    private async encodeAdapter(asset: Address, resolver: string): Promise<Hash> {
        const data = await resolveStrategyDefaults({
            client: this.publicClient,
            address: getAddress(asset),
            resolver
        })
        //console.log(data)
        if (!this.strategyDefaultsAreValid(data)) throw new Error(`Invalid adapter defaults for ${resolver} on ${asset}`);

        return encodeAbiParameters(data.params, data.default.map(v => v.value))

    }

    private async encodeStrategy(asset: Address, resolver: string): Promise<Hash> {
        const data = await resolveStrategyDefaults({
            client: this.publicClient,
            address: getAddress(asset),
            resolver
        })
        if (!this.strategyDefaultsAreValid(data)) throw new Error(`Invalid strategy defaults for ${resolver} on ${asset}`);
        
        return resolveStrategyEncoding({
            client: this.publicClient,
            address: getAddress(asset),
            params: data.default.slice(1).map(v => v.value), // @dev since the compounder return also the adapter param we remove it here
            resolver
        })
    }

    private async getAdapterAndStrategyData(strategy: string, asset: Address): Promise<{ adapter: StrategyData, strategy: StrategyData }> {
        let adapterId: Hash = stringToHex("", { size: 32 })
        let adapterInitParams: Hash = "0x"

        let strategyId: Hash = stringToHex("", { size: 32 })
        let strategyInitParams: Hash = "0x"

        if (strategy.includes("Depositor")) {
            // Encode Adapter
            adapterId = stringToHex(strategies[strategy].key, { size: 32 })
            adapterInitParams = await this.encodeAdapter(asset, strategies[strategy].resolver as string)
        } else {
            // Encode Adapter
            const adapter = strategies[strategies[strategy].adapter as string]
            adapterId = stringToHex((adapter.key as string), { size: 32 })
            adapterInitParams = await this.encodeAdapter(asset, adapter.resolver as string)

            // Encode Strategy
            strategyId = stringToHex((strategies[strategy].key as string), { size: 32 })
            strategyInitParams = await this.encodeStrategy(asset, strategies[strategy].resolver as string)
        }
        return {
            adapter: { id: adapterId, data: adapterInitParams },
            strategy: { id: strategyId, data: strategyInitParams },
        }
    }

    private async simulateVaultCreation(vault: VaultOptions, metadataCID: string, adapterData: StrategyData, strategyData: StrategyData, options?: WriteOptions): Promise<SimulationResponse> {
        try {
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
                        depositLimit: vault.depositLimit,
                        owner: vault.owner,
                    },
                    adapterData,
                    strategyData,
                    false,
                    EMPTY_BYTES, // reward data should be added in a separate step
                    {
                        metadataCID: metadataCID,
                        // these three will be overriden by the VaultController. Specifying them here is pointless.
                        // But, we have to include them in the type so that viem doesn't throw an error
                        vault: zeroAddress,
                        staking: zeroAddress,
                        creator: zeroAddress,
                        swapTokenAddresses: Array(8).fill(zeroAddress) as [Address, Address, Address, Address, Address, Address, Address, Address],
                        swapAddress: zeroAddress,
                        exchange: BigInt(0)

                    },
                    vault.initialDeposit,
                ]
            });
            return { request: request, success: true, error: undefined }
        } catch (error: any) {
            return { request: undefined, success: false, error: error.shortMessage }
        }
    }

    private async simulateAdapterCreation(asset: Address, adapterData: StrategyData, strategyData: StrategyData, initialDeposit: bigint, options?: WriteOptions): Promise<SimulationResponse> {
        try {
            const { request } = await this.publicClient.simulateContract({
                ...options,
                ...this.baseObj,
                functionName: "deployAdapter",
                args: [
                    asset,
                    adapterData,
                    strategyData,
                    initialDeposit
                ]
            });
            return { request: request, success: true, error: undefined }
        } catch (error: any) {
            return { request: undefined, success: false, error: error.shortMessage }
        }
    }

    getStrategyKeys(chainId: number): string[] {
        return Object.keys(strategies).filter(k => strategies[k].chains.includes(chainId))
    }


    async getStrategyParams({ strategy, asset }: { strategy: string, asset: Address }): Promise<StrategyDefault> {
        if (!strategies[strategy].chains.includes(this.chainId)) throw new Error("Strategy doesnt exist on your network");

        return resolveStrategyDefaults({
            client: this.publicClient,
            address: getAddress(asset),
            resolver: strategies[strategy].resolver as string
        })
    }

    async createVaultByKey({ vault, metadataCID, strategy, options }: CreateVaultByKeyParams): Promise<Hash> {
        if (!strategies[strategy].chains.includes(this.chainId)) throw new Error("Strategy doesnt exist on your network");
        if (vault.adapter !== zeroAddress) throw new Error("Vault adapter must be zero address")

        const { adapter: adapterData, strategy: strategyData } = await this.getAdapterAndStrategyData(strategy, vault.asset)
        const { request, success, error: simulationError } = await this.simulateVaultCreation(vault, metadataCID, adapterData, strategyData, options)
        if (success) {
            return this.walletClient.writeContract(request);
        } else {
            throw new Error(simulationError)
        }
    }

    async createStrategyByKey({ asset, initialDeposit, strategy, options }: CreateStrategyByKeyParams): Promise<Hash> {
        if (!strategies[strategy].chains.includes(this.chainId)) throw new Error("Strategy doesnt exist on your network");

        const { adapter: adapterData, strategy: strategyData } = await this.getAdapterAndStrategyData(strategy, asset)
        const { request, success, error: simulationError } = await this.simulateAdapterCreation(asset, adapterData, strategyData, initialDeposit, options)
        if (success) {
            return this.walletClient.writeContract(request);
        } else {
            throw new Error(simulationError)
        }
    }

    async createVault({ vault, adapterData, strategyData, metadataCID, options }: CreateVaultParams): Promise<Hash> {
        const { request, success, error: simulationError } = await this.simulateVaultCreation(vault, metadataCID, adapterData, strategyData, options)
        if (success) {
            return this.walletClient.writeContract(request);
        } else {
            throw new Error(simulationError)
        }
    }


    async createStrategy({ asset, adapterData, strategyData, initialDeposit, options }: CreateStrategyParams): Promise<Hash> {
        const { request, success, error: simulationError } = await this.simulateAdapterCreation(asset, adapterData, strategyData, initialDeposit, options)
        if (success) {
            return this.walletClient.writeContract(request);
        } else {
            throw new Error(simulationError)
        }
    }
}