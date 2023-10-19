import type { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol, getEmptyYield } from "./index.js";
import { Address, PublicClient, getAddress, parseUnits } from "viem";
import { IDLE_CDO_ABI } from "./abi/idle_cdo.js";
import axios from "axios";

// @dev Make sure the keys here are correct checksum addresses
const tranches: {
    [key: Address]: {
        cdo: Address,
        junior: Address,
        senior: Address
    }
} = {
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": {
        cdo: "0x5dca0b3ed7594a6613c1a2acd367d56e1f74f92d",
        junior: "0x38d36353d07cfb92650822d9c31fb4ada1c73d6e",
        senior: "0x43ed68703006add5f99ce36b5182392362369c1c"
    }, // dai clearpool portofino
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
        cdo: "0xe7c6a4525492395d65e736c3593ac933f33ee46e",
        junior: "0xbcc845bb731632ebe8ac0bfacde056170aaaaa06",
        senior: "0xdca1dae87f5c733c84e0593984967ed756579bee"
    }, // usdc clearpool fasanara
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
        cdo: "0xc4574C60a455655864aB80fa7638561A756C5E61",
        junior: "0x3Eb6318b8D9f362a0e1D99F6032eDB1C4c602500",
        senior: "0x0a6f2449c09769950cfb76f905ad11c341541f70"
    }, // usdt clearpool fasanara
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": {
        cdo: "0x8e0a8a5c1e5b3ac0670ea5a613bb15724d51fc37",
        junior: "0x990b3af34ddb502715e1070ce6778d8eb3c8ea82",
        senior: "0xdf17c739b666b259da3416d01f0310a6e429f592"
    }, // stEth instadapp
}


// @dev Make sure the keys here are correct checksum addresses
const assets: Address[] = [
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
    // "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"  // Matic
];

const apr2apy = (apr: bigint) => {
    return (1 + (Number(apr) / 1e20) / 365) ** 365 - 1;
};

abstract class IdleAbstract implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    key(): ProtocolName {
        return "idleJunior";
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        return getEmptyYield(asset);
    }

    async _getApy(chainId: number, asset: Address, tranche: "junior" | "senior"): Promise<Yield> {
        const client = this.clients[chainId];
        if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);

        const idleAddresses = tranches[asset];
        if (!idleAddresses) return getEmptyYield(asset);

        let apr;
        if (getAddress(asset) === "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84") {
            apr = await this._getStEthApy(client, idleAddresses.cdo, tranche === "senior");
        } else {
            apr = await this._getTrancheApr(client, idleAddresses.cdo, idleAddresses[tranche]);
        }

        const apy = apr2apy(apr) * 100;

        return {
            total: apy,
            apy: [{
                rewardToken: getAddress(asset),
                apy: apy
            }]
        };
    }

    private async _getTrancheApr(client: PublicClient, cdo: Address, tranche: Address): Promise<bigint> {
        return client.readContract({
            address: cdo,
            abi: IDLE_CDO_ABI,
            functionName: 'getApr',
            args: [tranche]
        });
    }

    private async _getStEthApy(client: PublicClient, cdo: Address, isBBTranche: boolean): Promise<bigint> {
        const poLidoStats = (await axios.get('https://api.idle.finance/poLidoStats', { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IkFwcDciLCJpYXQiOjE2NzAyMzc1Mjd9.L12KJEt8fW1Cvy3o7Nl4OJ2wtEjzlObaAYJ9aC_CY6M` } })).data
        const strategyApr = BigInt(poLidoStats.apr) * parseUnits("1", 18);
        const FULL_ALLOC = await client.readContract({
            address: cdo,
            abi: IDLE_CDO_ABI,
            functionName: 'FULL_ALLOC',
        });
        let currentAARatio = await client.readContract({
            address: cdo,
            abi: IDLE_CDO_ABI,
            functionName: 'getCurrentAARatio',
        });
        let trancheAPRSplitRatio = await client.readContract({
            address: cdo,
            abi: IDLE_CDO_ABI,
            functionName: 'trancheAPRSplitRatio',
        });

        if (isBBTranche) {
            trancheAPRSplitRatio = FULL_ALLOC - trancheAPRSplitRatio;
            currentAARatio = FULL_ALLOC - currentAARatio;
        }

        return strategyApr * trancheAPRSplitRatio / currentAARatio;
    }

    async getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) throw new Error("Idle vaults are only available on Ethereum mainnet");
        return assets.map(asset => getAddress(asset));
    };
}

export class IdleJunior extends IdleAbstract {
    key(): ProtocolName {
        return "idleJunior";
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        return super._getApy(chainId, asset, "junior");
    }
}

export class IdleSenior extends IdleAbstract {
    key(): ProtocolName {
        return "idleSenior";
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        return super._getApy(chainId, asset, "senior");
    }
}