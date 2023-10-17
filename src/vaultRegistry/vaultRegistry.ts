import { Address, PublicClient } from "viem";
import { VaultRegistyAbi } from "@/lib/constants/abi";
import { ADDRESS_ZERO } from "@/lib/helpers";
import { getVault, getVaults } from "./vault/getVault";
import { VaultData } from "./types";

export class VaultRegistry {
    address: Address;
    protected publicClient: PublicClient;
    private baseObj;


    constructor(address: Address, publicClient: PublicClient) {
        this.address = address;
        this.publicClient = publicClient;
        this.baseObj = {
            address,
            abi: VaultRegistyAbi,
        };
    }

    getAllVaultAddresses(): Promise<Address[]> {
        return this.publicClient.readContract({
            ...this.baseObj,
            functionName: "getRegisteredAddresses",
        }) as Promise<Address[]>;
    }

    getVault({ vault, user }: { vault: Address, user?: Address }): Promise<VaultData> {
        const account = user || ADDRESS_ZERO;
        return getVault({ vault, account, client: this.publicClient })
    }

    getVaults({ vaults, user }: { vaults: Address[], user?: Address }): Promise<VaultData[]> {
        const account = user || ADDRESS_ZERO;
        return getVaults({ vaults, account, client: this.publicClient })
    }

    async getAllVaults({ user }: { user?: Address }): Promise<VaultData[]> {
        const account = user || ADDRESS_ZERO;
        const vaults = await this.getAllVaultAddresses();
        return getVaults({ vaults, account, client: this.publicClient })
    }

    async getVaultsByDeployer({ creator, user }: { creator: Address, user?: Address }): Promise<VaultData[]> {
        const account = user || ADDRESS_ZERO;
        const vaults = await this.getAllVaultAddresses();
        return getVaults({ vaults, account, owner: creator, client: this.publicClient })
    }
}