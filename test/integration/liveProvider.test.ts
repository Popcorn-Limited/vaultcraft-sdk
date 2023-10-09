import { describe, test, expect, beforeAll } from "vitest";

import { AaveV2 } from "../../src/yieldOptions/providers/protocols/aavev2.js";
import { Clients } from "../../src/yieldOptions/providers/protocols/index.js";
import { publicClient } from "../setup.js";
import { CompoundV2 } from "../../src/yieldOptions/providers/protocols/compoundv2.js";
import { LiveProvider } from "../../src/yieldOptions/providers/liveProvider.js";

const clients: Clients = {
    1: publicClient,
};

test("allows passing custom list of protocols", async () => {
    const aaveV2 = new AaveV2(clients);
    const compoundV2 = new CompoundV2(clients);

    const provider = new LiveProvider(clients, 1000, [aaveV2, compoundV2]);
    expect(provider.getProtocols(1)).toEqual([
        {
            name: "Aave V2",
            key: "aaveV2",
            logoURI: "https://cryptologos.cc/logos/aave-aave-logo.png?v=024",
            description: "",
            tags: [],
            chains: [1]
        },
        {
            name: "Compound V2",
            key: "compoundV2",
            logoURI: "https://cdn.furucombo.app/assets/img/token/COMP.svg",
            description: "",
            tags: [],
            chains: [1]
        },
    ]);
});