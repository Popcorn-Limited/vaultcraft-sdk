import { Address, getAddress } from "viem";
import { Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol } from "./index.js";
import { CTOKEN_ABI } from "./abi/compound_v2_ctoken.js";

// Compound V2 is mainnet only. Thus we can simplify a lot of stuff
// @dev Make sure the keys here are correct checksum addresses
const assetToCToken = {
    // TODO: add ETH
    // AAVE
    "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": "0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c",
    // COMP
    "0xc00e94Cb662C3520282E6f5717214004A7f26888": "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4",
    // DAI
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    // BAT
    "0x0D8775F648430679A709E98d2b0Cb6250d2887EF": "0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E",
    // LINK
    "0x514910771AF9Ca656af840dff83E8264EcF986CA": "0xFAce851a4921ce59e912d19329929CE6da6EB0c7",
    // MKR
    "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": "0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b",
    // SAI
    "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359": "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
    // SUSHI
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2": "0x4B0181102A0112A2ef11AbEE5563bb4a3176c9d7",
    // TUSD
    "0x0000000000085d4780B73119b644AE5ecd22b376": "0x12392F67bdf24faE0AF363c24aC620a2f67DAd86",
    // UNI
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
    // USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    // USDT
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
    // wBTC
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": "0xccF4429DB6322D5C611ee964527D42E5d685DD6a",
    // ZRX
    "0xE41d2489571d322189246DaFA5ebDe1F4699F498": "0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407",
    // YFI
    "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e": "0x80a2AE356fc9ef4305676f7a3E2Ed04e12C33946",
};

export class CompoundV2 implements IProtocol {
    private clients: Clients;
    constructor(clients: Clients) {
        this.clients = clients;
    }

    async getApy(chainId: number, asset: Address): Promise<Yield> {
        if (chainId !== 1) throw new Error("Compound V2 is only available on Ethereum mainnet");

        const client = this.clients[chainId];
        if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);

        // @ts-ignore
        const cToken = assetToCToken[asset];

        const supplyRate = await client.readContract({
            // @ts-ignore
            address: cToken,
            abi: CTOKEN_ABI,
            functionName: 'supplyRatePerBlock'
        });

        const apy = (((Math.pow((Number(supplyRate) / 1e18 * 7200) + 1, 365))) - 1) * 100;

        return {
            total: apy,
            apy: [{
                rewardToken: getAddress(asset),
                apy: apy
            }]
        };
    }

    getAssets(chainId: number): Promise<Address[]> {
        if (chainId !== 1) throw new Error("Compound V2 is only available on Ethereum mainnet");

        return Promise.resolve(Object.keys(assetToCToken).map((key) => getAddress(key)));
    }
}