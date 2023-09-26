import { Address, getAddress } from "viem";
import { ChainToAddress, Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol } from "./index.js";
import { LENDING_POOL_ABI } from "./abi/aave_v2_lending_pool.js";

const LENDING_POOL: ChainToAddress = { 1: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9" };

export class AaveV2 implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);

        const reserveData = await client.readContract({
            address: LENDING_POOL[chainId],
            abi: LENDING_POOL_ABI,
            functionName: 'getReserveData',
            args: [asset]
        });

        // divided by 1e27 * 100 for percent
        const apy = Number(reserveData[3]) / 1e25;

        return {
            total: apy,
            apy: [{
                rewardToken: getAddress(asset),
                apy: apy
            }]
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);
        try {
            const assets = await client.readContract({
                address: LENDING_POOL[chainId],
                abi: LENDING_POOL_ABI,
                functionName: "getReservesList",
            }) as Address[]; // viem returns `readonly` type which we don't want
            return assets.map(asset => getAddress(asset));
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}