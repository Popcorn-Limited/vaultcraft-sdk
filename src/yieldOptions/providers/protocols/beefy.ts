import { Yield } from "src/yieldOptions/types.js";
import { getEmptyYield, IProtocol } from "./index.js";
import { Address, getAddress } from "viem";
import { networkNames } from "@/lib/helpers.js";
import NodeCache from "node-cache";
import axios from "axios";

interface BeefyVault {
    id: string;
    status: "active" | "eol";
    network: string;
    tokenAddress: Address;
}

interface ApyBreakdown {
    [key: string]: VaultApy;
}

interface VaultApy {
    totalApy: number;
}

export class Beefy implements IProtocol {
    private cache: NodeCache;

    constructor(ttl: number) {
        this.cache = new NodeCache({ stdTTL: ttl });
    }
    async getApy(chainId: number, asset: Address): Promise<Yield> {
        let vaults = await this.getActiveVaults();

        const apy = await this.getApys();

        vaults = vaults.filter((vault) =>
            vault.network === networkNames[chainId].toLowerCase()
        );
        const beefyVaultObj = vaults.find(vault => vault.tokenAddress.toLowerCase() === asset.toLowerCase());

        return !beefyVaultObj ? getEmptyYield(asset) : {
            total: apy[beefyVaultObj.id].totalApy * 100,
            apy: [{
                rewardToken: getAddress(asset),
                apy: apy[beefyVaultObj.id].totalApy * 100
            }]
        };
    }

    async getAssets(chainId: number): Promise<Address[]> {
        let vaults = await this.getActiveVaults();
        vaults = vaults.filter((vault) =>
            vault.network === networkNames[chainId].toLowerCase()
        );
        // there are cases where tokenAddress is undefined. We have to filter those out
        return vaults.filter((vault) => vault.tokenAddress).map((vault) => getAddress(vault.tokenAddress));
    };

    private async getActiveVaults(): Promise<BeefyVault[]> {
        let vaults = this.cache.get("vaults") as BeefyVault[];
        if (!vaults) {
            vaults = (await axios.get("https://api.beefy.finance/vaults")).data;
            vaults = vaults.filter((vault) => vault.status === "active");
            this.cache.set("vaults", vaults);
        }
        return vaults;
    }

    private async getApys(): Promise<ApyBreakdown> {
        let apy = this.cache.get("apy") as ApyBreakdown;
        if (!apy) {
            apy = (await axios("https://api.beefy.finance/apy/breakdown")).data;
            this.cache.set("apy", apy);
        }
        return apy;
    }
}