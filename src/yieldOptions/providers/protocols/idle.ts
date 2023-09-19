import type { Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol, getEmptyYield } from "./index.js";
import { Address, getAddress } from "viem";
import { IDLE_CDO_ABI } from "./abi/idle_cdo.js";

// TODO -- Split idle into two protocols. Idle Junior and Idle Senior
// @dev Make sure the keys here are correct checksum addresses
const tranches = {
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": { cdo: "0x5dca0b3ed7594a6613c1a2acd367d56e1f74f92d", tranch: "0x38d36353d07cfb92650822d9c31fb4ada1c73d6e" }, // dai junior
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { cdo: "0x1329E8DB9Ed7a44726572D44729427F132Fa290D", tranch: "0xf85Fd280B301c0A6232d515001dA8B6c8503D714" }, // usdc junior
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": { cdo: "0xc4574C60a455655864aB80fa7638561A756C5E61", tranch: "0x3Eb6318b8D9f362a0e1D99F6032eDB1C4c602500" }, // usdt junior
};

// @dev Make sure the keys here are correct checksum addresses
const assets: Address[] = [
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
    "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"  // Matic
];

const apr2apy = (apr: BigInt) => {
    return (1 + (Number(apr) / 1e20) / 365) ** 365 - 1;
};

export class Idle implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`missing public client for chain ID: ${chainId}`);

        // @ts-ignore
        const idleAddresses = tranches[asset.toLowerCase()];
        if (!idleAddresses) return getEmptyYield(asset);

        const apr = await client.readContract({
            address: idleAddresses.cdo,
            abi: IDLE_CDO_ABI,
            functionName: 'getApr',
            args: [asset]
        });

        const apy = apr2apy(apr) * 100;

        return {
            total: apy,
            apy: [{
                rewardToken: getAddress(asset),
                apy: apy
            }]
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) throw new Error("Idle vaults are only available on Ethereum mainnet");
        return assets.map(asset => getAddress(asset));
    };
}
