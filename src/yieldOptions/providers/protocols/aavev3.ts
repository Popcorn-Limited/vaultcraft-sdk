import { Address } from "viem";
import { Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol, EMPTY_YIELD_RESPONSE } from "./index.js";
import { LENDING_POOL_ABI } from "./abi/aave_v3_lending_pool.js";

const LENDING_POOL = { 1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" };

export class AaveV3 implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`missing public client for chain ID: ${chainId}`);

        const reserveData = await client.readContract({
            // @ts-ignore
            address: LENDING_POOL[chainId],
            abi: LENDING_POOL_ABI,
            functionName: 'getReserveData',
            args: [asset]
        });

        // divided by 1e27 * 100 for percent
        const apy = Number(reserveData[2]) / 1e25;

        return {
            total: apy,
            apy: [{
                rewardToken: asset,
                apy: apy
            }]
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`missing public client for chain ID: ${chainId}`);
        try {
            return await client.readContract({
                // TODO: find a cleaner way to pass an arbitrary chainID here
                // @ts-ignore
                address: LENDING_POOL[chainId],
                abi: LENDING_POOL_ABI,
                functionName: "getReservesList",
            }) as Address[]; // viem returns `readonly` type which we don't want
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}