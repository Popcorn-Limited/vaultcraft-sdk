import { AaveV2, AaveV3, Aura, Beefy, Clients, CompoundV2, Curve, IProtocol, Idle, Origin, Yearn } from "./protocols/index.js";
import { Address } from "viem";
import { ProtocolName, Yield } from "../types.js";
import { Balancer } from "./protocols/balancer.js";
import { CompoundV3 } from "./protocols/compoundv3.js";
import { Flux } from "./protocols/flux.js";
import { Convex } from "./protocols/convex.js";

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
            "compoundV3": new CompoundV3(clients),
            "curve": new Curve(ttl),
            "idle": new Idle(clients),
            "origin": new Origin(),
            "yearn": new Yearn(clients, ttl),
            "balancer": new Balancer(ttl),
            "flux": new Flux(clients[1]),
            "convex": new Convex(ttl),
        };
    }

    getProtocols(chainId: number): ProtocolName[] {
        // TODO: differentiate by chain
        return Object.keys(this.protocols) as ProtocolName[];
    }

    getAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        return this.protocols[protocol].getAssets(chainId);
    }

    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        return this.protocols[protocol].getApy(chainId, asset);
    }
}

export interface IProtocolProvider {
    getProtocols(chainId: number): ProtocolName[];
    getAssets(chainId: number, protocol: ProtocolName): Promise<Address[]>;
    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield>;
}