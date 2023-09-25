import { AaveV2, AaveV3, Aura, Beefy, Clients, CompoundV2, Curve, IProtocol, IdleJunior, IdleSenior, Origin, Yearn, Balancer, CompoundV3, Flux, Convex } from "./protocols/index.js";
import { Address, getAddress } from "viem";
import { IProtocolProvider, ProtocolName, Yield } from "../types.js";

export class LiveProvider implements IProtocolProvider {
    private protocols: {
        [name: string]: IProtocol;
    };

    // @dev Dont forget to add the protocolName in ./types.ts after adding a new protocol
    constructor(clients: Clients, ttl: number) {
        this.protocols = {
            "aaveV2": new AaveV2(clients),
            "aaveV3": new AaveV3(clients),
            "aura": new Aura(ttl),
            "beefy": new Beefy(ttl),
            "compoundV2": new CompoundV2(clients),
            "compoundV3": new CompoundV3(clients),
            "curve": new Curve(ttl),
            "idleJunior": new IdleJunior(clients),
            "idleSenior": new IdleSenior(clients),
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

    async getProtocolAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        return (await this.protocols[protocol].getAssets(chainId)).map(asset => getAddress(asset));
    }

    async getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        const result = await this.protocols[protocol].getApy(chainId, getAddress(asset));
        result.apy = result.apy?.map(e => { return { rewardToken: getAddress(e.rewardToken), apy: e.apy } });
        return result;
    }
}