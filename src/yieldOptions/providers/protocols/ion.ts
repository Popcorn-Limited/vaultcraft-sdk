import { Address, getAddress } from "viem";
import { ProtocolName, Yield } from "src/yieldOptions/types.js";
import { IProtocol, getEmptyYield } from "./index.js";

// @dev Make sure the keys here are correct checksum addresses
const ION_TOKENS: Address[] = ["0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee", "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7"];


export class Ion implements IProtocol {
    key(): ProtocolName {
        return "ion";
    }
    async getApy(chainId: number, asset: Address): Promise<Yield> {
        if (chainId !== 1) throw new Error("Ion is only supported on Ethereum mainnet");

        return getEmptyYield(asset)
    }

    async getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) throw new Error("Ion is only supported on Ethereum mainnet");

        return ION_TOKENS.map(asset => getAddress(asset));
    }
}