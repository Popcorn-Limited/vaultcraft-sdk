import { startProxy } from "@viem/anvil";
export default async function () {
    return await startProxy({
        port: 8545, // By default, the proxy will listen on port 8545.
        host: "::", // By default, the proxy will listen on all interfaces.
        options: {
            chainId: 123,
            forkUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        },
    });
}