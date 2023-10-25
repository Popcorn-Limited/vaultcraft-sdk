import { Address, getAddress } from "viem";
import { IProtocolProvider, Protocol, ProtocolName, Yield } from "../../src/yieldOptions/types.js";
import protocols from "../../src/lib/constants/protocols.js";

type ProtocolYieldData = {
    [chainId: number]: {
        [protocol: string]: {
            [asset: string]: number;
        };
    };
};

export class MockLiveProvider implements IProtocolProvider {
    private data: ProtocolYieldData = {};

    constructor(data: ProtocolYieldData) {
        this.setData(data);
    }

    setData(data: ProtocolYieldData) {
        Object.keys(data).forEach(chain => {
            const chainId = Number(chain);
            this.data[chainId] = {};
            Object.keys(data[chainId]).forEach(protocol => {
                this.data[chainId][protocol] = {};
                Object.keys(data[chainId][protocol]).forEach(address =>
                    this.data[chainId][protocol][getAddress(address)] = data[chainId][protocol][address]
                )
            })
        });
    }

    setAsset(chainId: number, protocol: string, asset: Address, apy: number) {
        this.data[chainId][protocol][getAddress(asset)] = apy;
    }

    setProtocol(chainId: number, protocol: string, data: { [asset: string]: number; }) {
        Object.keys(data).forEach(key => this.data[chainId][protocol][getAddress(key)] = data[key]);
    }

    getProtocols(chainId: number): Protocol[] {
        // This will fail if other chainIds are used
        return Object.keys(this.data[chainId]).map(key => protocols[key]);
    }

    getProtocolAssets({ chainId, protocol }: { chainId: number, protocol: ProtocolName }): Promise<Address[]> {
        return Promise.resolve(Object.keys(this.data[chainId][protocol]).map(address => getAddress(address)));
    }

    getApy({ chainId, protocol, asset }: { chainId: number, protocol: ProtocolName, asset: Address }): Promise<Yield> {
        const assetYield = this.data[chainId][protocol][getAddress(asset)];
        return Promise.resolve({
            total: assetYield,
            apy: [
                {
                    rewardToken: getAddress(asset),
                    apy: assetYield,
                }
            ]
        });
    }
}