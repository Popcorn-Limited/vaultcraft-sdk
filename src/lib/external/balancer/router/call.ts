import axios from 'axios';
import type { BalancerData, BalanceSORResponse } from './interfaces.js';
import { BalancerSDK } from '@balancer-labs/sdk'

export const balancerApiProxyCall = async (balancerParams: BalancerData): Promise<BalanceSORResponse> => {
    // const balancer = new BalancerSDK({
    //     network: 1, // Mainnet
    //     rpcUrl: 'https://rpc.ankr.com/eth' // rpc endpoint
    //   })
    
    // const response = await swaps.findRouteGivenIn({
    //     tokenIn: balancerParams.sellToken,
    //     tokenOut: balancerParams.buyToken,
    //     // @ts-ignore      
    //     amount: balancerParams.amount,
    //     // @ts-ignore    
    //     gasPrice: balancerParams.gasPrice,
    //     maxPools: 4,
    // })
    // console.log(response)
    // return response
    const endpointUrl = "https://api.balancer.fi/api/balancerProxy/sor/1";

    try {
        const response = await axios.post(endpointUrl, balancerParams, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};