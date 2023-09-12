import { AaveV2, AaveV3, Aura, Beefy, Clients, CompoundV2, Curve, IProtocol, Idle, Origin, Yearn } from "@/lib/resolver/protocol/index.js";
import { Address } from "viem";
import assets from "./assets.json";
import { ProtocolName, Yield } from "./types.js";

export class ProtocolProvider implements IProtocolProvider {
    private protocols: {
        [name: string]: IProtocol;
    };
    constructor(clients: Clients, ttl: number) {
        this.protocols = {
            "aaveV2": new AaveV2(clients),
            "aaveV3": new AaveV3(clients),
            "aura": new Aura(ttl),
            "beefy": new Beefy(ttl),
            "compoundV2": new CompoundV2(clients),
            "curve": new Curve(ttl),
            "idle": new Idle(clients),
            "origin": new Origin(),
            "yearn": new Yearn(clients, ttl),
        };
    }

    getProtocols(): ProtocolName[] {
        return Object.keys(this.protocols) as ProtocolName[];
    }

    async getAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        let allAssets: Address[];
        if (chainId === 1) {
            allAssets = assets[1][protocol] as Address[];
        } else {
            allAssets = await this.protocols[protocol].getAssets(chainId);
        }

        return allAssets;

    }

    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        return this.protocols[protocol].getApy(chainId, asset);
    }
}

export interface IProtocolProvider {
    getProtocols(): ProtocolName[];
    getAssets(chainId: number, protocol: ProtocolName): Promise<Address[]>;
    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield>;
}