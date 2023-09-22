import { Address } from "viem";
import { IProtocolProvider, ProtocolName, Yield } from "../../src/yieldOptions/types.js";


type ProtocolYieldData = {
    [chainId: number]: {
        [protocol: string]: {
            [asset: string]: number;
        };
    };
};

export class MockLiveProvider implements IProtocolProvider {
    private data: ProtocolYieldData;
    constructor(data: ProtocolYieldData) {
        this.data = data;
    }

    setData(data: ProtocolYieldData) {
        this.data = data;
    }

    setAsset(chainId: number, protocol: string, asset: Address, apy: number) {
        this.data[chainId][protocol][asset] = apy;
    }

    setProtocol(chainId: number, protocol: string, data: { [asset: string]: number; }) {
        this.data[chainId][protocol] = data;
    }

    getApy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield> {
        const assetYield = this.data[chainId][protocol][asset];
        return Promise.resolve({
            total: assetYield,
            apy: [
                {
                    rewardToken: asset,
                    apy: assetYield,
                }
            ]
        });
    }

    getProtocolAssets(chainId: number, protocol: ProtocolName): Promise<Address[]> {
        return Promise.resolve(Object.keys(this.data[chainId][protocol]) as Address[]);
    }

    getProtocols(): ProtocolName[] {
        // TODO: should use chainId.
        // This will fail if other chainIds are used
        return Object.keys(this.data[1]) as ProtocolName[];
    }
}