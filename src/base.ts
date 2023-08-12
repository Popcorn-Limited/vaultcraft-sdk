import { Address, PublicClient } from "viem";

export class Base {
    address: Address;
    protected client: PublicClient;

    constructor(address: Address, publicClient: PublicClient) {
        this.address = address;
        this.client = publicClient;
    }
}