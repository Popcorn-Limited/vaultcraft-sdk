import { ADDRESS_ZERO, ZERO } from "../../../constants/index.js";
import { Address, Hash, encodeAbiParameters, getAddress } from "viem";
import curve from "@curvefi/api";
import { IRoute } from "@curvefi/api/lib/interfaces.js";

export interface CurveRoute {
    route: Address[];
    swapParams: bigint[][]
}

const EMPTY_ROUTE = [ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO]

const EMPTY_SWAP_PARAMS = [
    [ZERO, ZERO, ZERO],
    [ZERO, ZERO, ZERO],
    [ZERO, ZERO, ZERO],
    [ZERO, ZERO, ZERO]
]

const curveInit: () => Promise<void> = async () => {
    await curve.init("Alchemy", { network: "homestead", apiKey: "KsuP431uPWKR3KFb-K_0MT1jcwpUnjAg" }, { chainId: 1 });
    await curve.factory.fetchPools();
    await curve.crvUSDFactory.fetchPools();
    await curve.EYWAFactory.fetchPools();
    await curve.cryptoFactory.fetchPools();
    await curve.tricryptoFactory.fetchPools();
}

function processRoute(route: IRoute): CurveRoute {
    const routeSteps: Address[] = [];
    const swapParams: bigint[][] = [];
    for (let i = 0; i < route.length; i++) {
        swapParams[i] = [BigInt(route[i].i), BigInt(route[i].j), BigInt(route[i].swapType)];
        if (i === 0) {
            routeSteps.push(getAddress(route[i].inputCoinAddress));
            routeSteps.push(getAddress(route[i].poolAddress));
            routeSteps.push(getAddress(route[i].outputCoinAddress));
        } else {
            routeSteps.push(getAddress(route[i].poolAddress));
            routeSteps.push(getAddress(route[i].outputCoinAddress));
        }
    }
    if (routeSteps.length < 9) {
        const addZeroAddresses = 9 - routeSteps.length;
        for (let i = 0; i < addZeroAddresses; i++) {
            routeSteps.push(ADDRESS_ZERO)
        }
    }
    if (swapParams.length < 4) {
        const addEmptySwapParams = 4 - swapParams.length;
        for (let i = 0; i < addEmptySwapParams; i++) {
            swapParams.push([ZERO, ZERO, ZERO]);
        }
    }

    const curveRoute: CurveRoute = {
        route: routeSteps,
        swapParams: swapParams
    }
    return curveRoute;
}


export const curveApiCall = async ({
    depositAsset,
    rewardTokens,
    baseAsset,
    router,
    minTradeAmounts,
    optionalData
}: {
    depositAsset: Address,
    rewardTokens: Address[],
    baseAsset: Address,
    router: Address,
    minTradeAmounts: bigint[],
    optionalData: Hash
}): Promise<{ baseAsset: Address, router: Address, toBaseAssetRoutes: CurveRoute[], toAssetRoute: CurveRoute, minTradeAmounts: bigint[], optionalData: Hash }> => {
    if (rewardTokens.length !== minTradeAmounts.length) {
        throw new Error("rewardTokens and minTradeAmounts must be the same length");
    }
    // console.log("curveApiCall", { depositAsset, rewardTokens, baseAsset, router, minTradeAmounts, optionalData })
    await curveInit();
    //console.log("res", await curve.router.expected("0x6B175474E89094C44Da98b954EedeAC495271d0F", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", '1000'))
    const toBaseAssetRoutes: CurveRoute[] = [];
    for (let i = 0; i < rewardTokens.length; i++) {
        const inputToken = rewardTokens[i];
        const outputToken = baseAsset;
        const { route: rewardRoute, } = await curve.router.getBestRouteAndOutput(inputToken, outputToken, '1000');
        //console.log({ rewardRoute })
        const toBaseAssetRoute = processRoute(rewardRoute);
        toBaseAssetRoutes.push(toBaseAssetRoute);
    }

    let toAssetRoute;
    if (getAddress(baseAsset) !== getAddress(depositAsset)) {
        const { route: assetRoute, } = await curve.router.getBestRouteAndOutput(baseAsset, depositAsset, '1000');
        toAssetRoute = processRoute(assetRoute);
    } else {
        // fill empty route
        toAssetRoute = {
            route: EMPTY_ROUTE,
            swapParams: EMPTY_SWAP_PARAMS
        }
    }

    return { baseAsset, router, toBaseAssetRoutes, toAssetRoute, minTradeAmounts, optionalData }
}


export const curveApiCallToBytes = async ({
    depositAsset,
    rewardTokens,
    baseAsset,
    router,
    minTradeAmounts,
    optionalData
}: {
    depositAsset: Address,
    rewardTokens: Address[],
    baseAsset: Address,
    router: Address,
    minTradeAmounts: bigint[],
    optionalData: Hash
}): Promise<Hash> => {
    const curveData = await curveApiCall({ depositAsset, rewardTokens, baseAsset, router, minTradeAmounts, optionalData });
    console.log({ curveData })
    // Prepare the data for encoding.
    const values = [
        curveData.baseAsset,
        curveData.router,
        curveData.toBaseAssetRoutes,
        curveData.toAssetRoute,
        curveData.minTradeAmounts,
        curveData.optionalData
    ];
    // @dev typescript cant infer the types of the encodeAbiParameters function since we are using a dynamic array of types
    // @ts-ignore
    return encodeAbiParameters(encodeAbi, values);
}

const baseAssetAbi = { name: 'baseAsset', type: 'address' } as const
const routerAbi = { name: 'router', type: 'address' } as const
const toBaseAssetRoutesAbi = {
    "components": [
        {
            "internalType": "address[9]",
            "name": "route",
            "type": "address[9]"
        },
        {
            "internalType": "uint256[3][4]",
            "name": "swapParams",
            "type": "uint256[3][4]"
        }
    ],
    "internalType": "struct CurveRoute[]",
    "name": "_toBaseAssetRoutes",
    "type": "tuple[]"
} as const
const toAssetRouteAbi = {
    "internalType": "struct CurveRoute",
    "name": "_toAssetRoute",
    "type": "tuple",
    "components": [
        {
            "internalType": "address[9]",
            "name": "route",
            "type": "address[9]"
        },
        {
            "internalType": "uint256[3][4]",
            "name": "swapParams",
            "type": "uint256[3][4]"
        }
    ]
} as const;
const minAmountOutAbi = { name: 'numbers', type: 'uint256[]' } as const
const optionalDataAbi = { name: 'optionalData', type: 'bytes' } as const

const encodeAbi = [baseAssetAbi, routerAbi, toBaseAssetRoutesAbi, toAssetRouteAbi, minAmountOutAbi, optionalDataAbi] as const
