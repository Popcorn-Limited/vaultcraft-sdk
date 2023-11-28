import { AaveV2, AaveV3, Aura, Beefy, Clients, CompoundV2, Curve, IProtocol, IdleJunior, IdleSenior, Origin, Yearn, Balancer, CompoundV3, Flux, Convex, Stargate, YearnFactory, Pirex, Sommelier } from "./protocols/index.js";
import { Address, getAddress } from "viem";
import { IProtocolProvider, Protocol, ProtocolName, Yield } from "../types.js";
import protocols from "@/lib/constants/protocols.js";

export class LiveProvider implements IProtocolProvider {
    private protocols: {
        [name: string]: IProtocol;
    };

    // @dev Dont forget to add the protocolName in ./types.ts after adding a new protocol
    constructor({ clients, ttl, protocols }: { clients: Clients, ttl: number, protocols?: IProtocol[] }) {
        // if a user passes their own list of protocols, we only use those in the provider.
        // Otherwise, we use all the available ones (default behaviour).
        if (protocols) {
            this.protocols = {};
            protocols.forEach((protocol) => {
                this.protocols[protocol.key()] = protocol;
            });
        } else {
            this.protocols = {
                "aaveV2": new AaveV2(clients),
                "aaveV3": new AaveV3(clients),
                "aura": new Aura(ttl),
                "balancer": new Balancer(ttl),
                "beefy": new Beefy(ttl),
                "compoundV2": new CompoundV2(clients),
                "compoundV3": new CompoundV3(clients),
                "convex": new Convex(ttl),
                "curve": new Curve(ttl),
                "flux": new Flux(clients[1]),
                "idleJunior": new IdleJunior(clients),
                "idleSenior": new IdleSenior(clients),
                "origin": new Origin(),
                "stargate": new Stargate(clients, ttl),
                "yearn": new Yearn(clients, ttl),
                "yearnFactory": new YearnFactory(clients, ttl),
                "pirex": new Pirex(clients, ttl),
                "sommelier": new Sommelier(clients[1])
            };
        }
    }

    getProtocols(chainId: number): Protocol[] {
        return Object.entries(protocols)
            .filter(([key, protocol]) => protocol.chains.includes(chainId) && Object.keys(this.protocols).includes(protocol.key))
            .map(([key, protocol]) => protocol);
    }

    async getProtocolAssets({ chainId, protocol }: { chainId: number, protocol: ProtocolName }): Promise<Address[]> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        return (await this.protocols[protocol].getAssets(chainId)).map(asset => getAddress(asset));
    }

    async getApy({ chainId, protocol, asset }: { chainId: number, protocol: ProtocolName, asset: Address }): Promise<Yield> {
        if (!this.protocols[protocol]) throw new Error(`${protocol} not supported`);
        const result = await this.protocols[protocol].getApy(chainId, getAddress(asset));
        result.apy = result.apy?.map(e => { return { rewardToken: getAddress(e.rewardToken), apy: e.apy } });
        return result;
    }
}