import { Address, getAddress } from "viem";
import { StrategyDefault, StrategyDefaultResolverParams } from "../index.js";

const BASE_RESPONSE = {
      params: [{
        name: "crv",
        type: "address",
    }]
}

export const CURVE_ADDRESS: { [chainId: number]: Address; } = {
    1: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    10: "0x0994206dfe8de6ec6920ff4d779b0d950605fb53",
    137: "0x172370d5cd63279efa6d502dab29171933a610af",
    250: "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
    42161: "0x11cdb42b0eb46d95f990bedd4695a6e3fa034978",
};

export async function curveChild({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
    const chainId = client.chain?.id as number

    return {
        ...BASE_RESPONSE,
        default: [
            { name: "crv", value: Object.keys(CURVE_ADDRESS).includes(String(chainId)) ? getAddress(CURVE_ADDRESS[chainId]) : null }
        ]
    }
}