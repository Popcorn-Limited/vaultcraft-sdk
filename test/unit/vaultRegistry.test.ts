import { describe, test, expect, beforeAll } from "vitest";
import { publicClient } from "../setup";
import { VaultRegistry } from "../../src/vaultRegistry";


let registry = new VaultRegistry({ address: "0x007318Dc89B314b47609C684260CfbfbcD412864", publicClient });
const FORK_BLOCK_NUMBER = BigInt(17883751);

describe.concurrent("read-only", () => {

    beforeAll(async () => {
        await publicClient.reset({
            blockNumber: FORK_BLOCK_NUMBER,
        });
    });

    test("getAllVaultAddresses() should give back all registered addresses", async () => {
        const allVaults = await registry.getAllVaultAddresses();

        expect(allVaults[0]).toBe("0x5d344226578DC100b2001DA251A4b154df58194f");
        expect(allVaults[1]).toBe("0xc1D4a319dD7C44e332Bd54c724433C6067FeDd0D");
        expect(allVaults[20]).toBe("0x860b717B360378E44A241b23d8e8e171E0120fF0");
    });

    test("getVault() should give back all vaultData for vault at address", async () => {
        const vault = "0x5d344226578DC100b2001DA251A4b154df58194f";
        const vaultData = await registry.getVault(vault);

        expect(vaultData.vault).toBe("0x5d344226578DC100b2001DA251A4b154df58194f");
        expect(vaultData.staking).toBe("0x0000000000000000000000000000000000000000");
        expect(vaultData.creator).toBe("0x22f5413C075Ccd56D575A54763831C4c27A37Bdb");
        expect(vaultData.metadataCID).toBe("");
        expect(vaultData.exchange).toBe(BigInt(0));
    });

    test("getVaultByDeployer() should give back all vaults deployed by specified creator", async () => {
        const creator = "0x22f5413C075Ccd56D575A54763831C4c27A37Bdb";
        const vaults = await registry.getVaultByDeployer(creator);

        expect(vaults[0]).toBe("0x5d344226578DC100b2001DA251A4b154df58194f");
        expect(vaults[1]).toBe("0xc1D4a319dD7C44e332Bd54c724433C6067FeDd0D");
        expect(vaults[20]).toBe("0x860b717B360378E44A241b23d8e8e171E0120fF0");
    });
});