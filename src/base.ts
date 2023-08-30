import type { Address, PublicClient, WalletClient, Transport, Chain } from "viem";

export class Base {
    address: Address;
    protected publicClient: PublicClient;
    protected walletClient: WalletClient<Transport, Chain>;

    constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain>) {
        this.address = address;
        this.publicClient = publicClient;
        this.walletClient = walletClient;
    }
}