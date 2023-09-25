import axios from "axios";
import { IProtocolProvider, ProtocolName, Yield } from "../types.js";
import { Address, getAddress } from "viem";

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


    getProtocols(chainId: number): ProtocolName[] {
        return Object.keys(this.data[chainId]) as ProtocolName[];
    }

    async getProtocolAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        return Promise.resolve(Object.keys(this.data[chainId][protocol]).map(asset => getAddress(asset)));
    }

    async getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        const result = this.data[chainId][protocol][getAddress(asset)];
        result.apy = result.apy?.map(e => { return { rewardToken: getAddress(e.rewardToken), apy: e.apy } });
        return Promise.resolve(result);
    }

}