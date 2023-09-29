import axios from "axios";
import { IProtocolProvider, Protocol, ProtocolName, Yield } from "../types.js";
import { Address, getAddress } from "viem";
import protocols from "@/lib/constants/protocols.js";

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
        const { data }: { data: Data } = await axios.get(url);
        Object.keys(data).forEach(chain => {
            const chainId = Number(chain);
            this.data[Number(chainId)] = {};
            Object.keys(data[chainId]).forEach(protocol => {
                this.data[chainId][protocol] = {};
                Object.keys(data[chainId][protocol]).forEach(address =>
                    this.data[chainId][protocol][getAddress(address)] = data[chainId][protocol][address]
                )
            })
        });
    }

    getProtocols(chainId: number): Protocol[] {
        return Object.keys(this.data[chainId]).map(key => protocols[key]);
    }

    getProtocolAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        return Promise.resolve(Object.keys(this.data[chainId][protocol]).map(asset => getAddress(asset)));
    }

    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        const result = this.data[chainId][protocol][getAddress(asset)];
        result.apy = result.apy?.map(e => { return { rewardToken: getAddress(e.rewardToken), apy: e.apy } });
        return Promise.resolve(result);
    }
}