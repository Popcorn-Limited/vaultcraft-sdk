import axios from "axios";
import { IProtocolProvider } from "./protocolProvider.js";
import { ProtocolName, Yield } from "../types.js";
import { Address } from "viem";

type Data = {
    [chainId: number]: {
        [protocol: string]: {
            [asset: string]: Yield;
        };
    };
};

export class CachedProvider implements IProtocolProvider {
    private data: Data = {};

    async initialize(url: string): Promise<void> {
        const { data } = await axios.get(url);
        this.data = data;
    }

    getAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        return Promise.resolve(Object.keys(this.data[chainId][protocol]) as Address[]);
    }

    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        return Promise.resolve(this.data[chainId][protocol][asset]);
    }

    getProtocols(chainId: number): ProtocolName[] {
        return Object.keys(this.data[chainId]) as ProtocolName[];
    }
}