import { createAnvil } from "@viem/anvil";
import { YieldOptions, ProtocolProvider } from "../dist/index.js";
import { createPublicClient, http } from "viem";
import { writeFileSync } from "fs";

(async () => {
    // we use a local anvil instance to decrease the number of RPC requests sent to a public endpoint.
    const anvil = createAnvil({
        forkUrl: "https://eth.llamarpc.com",
    });
    const publicClient = createPublicClient({
        chain: anvil,
        mode: "anvil",
        transport: http("http://127.0.0.1:8545"),
    });
    console.log("starting anvil instance");
    await anvil.start();

    const provider = new ProtocolProvider({ 1: publicClient }, 10000);
    const yieldOptions = new YieldOptions(provider, 1000);
    const result = {
        1: {},
    }
    for (const protocol of provider.getProtocols(1)) {
        console.log(`pulling yield data for ${protocol}`);
        result[1][protocol] = {};
        try {

            const protocolData = await yieldOptions.getYieldOptionsByProtocol(1, protocol);
            protocolData.forEach((data) => {
                result[1][protocol][data.address] = data.yield;
            });
        } catch (e) {
            console.log("failed to pull yield data for ", protocol);
            console.error(e);
        }
    }
    console.log("stopping anvil instance");
    await anvil.stop();

    console.log("saving result in apy-data.json");
    writeFileSync("./apy-data.json", JSON.stringify(result), "utf-8");
})();