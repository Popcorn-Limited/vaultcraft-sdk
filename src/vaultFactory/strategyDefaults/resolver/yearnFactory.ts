import { Address, getAddress } from "viem";
import { ERROR_RESPONSE, StrategyDefault, StrategyDefaultResolverParams } from "../index.js";
import axios from "axios"


type BalancerGauge = {
  address: Address;
  lpToken: Address;
};

type PoolData = {
  lpTokenAddress: Address;
  gaugeAddress: Address;
  gaugeCrvApy: number[];
};

const BASE_RESPONSE = {
  params: [{
    name: "gauge",
    type: "address",
  }, {
    name: "maxLoss",
    type: "uint256",
  }]
}

export async function yearnFactory({ client, address }: StrategyDefaultResolverParams): Promise<StrategyDefault> {
  const chainId = client.chain?.id as number;

  const balancerGauges = await getBalancerGauges(chainId);
  const balResult = balancerGauges.find(bal => getAddress(bal.lpToken) === getAddress(address));
  if (balResult) {
    return {
      ...BASE_RESPONSE,
      default: [{ name: "gauge", value: getAddress(balResult.address) }, { name: "maxLoss", value: 1 }]
    }
  }

  const curvePoolData = await getCurvePoolData(chainId);
  const crvResult = curvePoolData.find(crv => getAddress(crv.lpTokenAddress) === getAddress(address));
  if (crvResult) {
    return {
      ...BASE_RESPONSE,
      default: [{ name: "gauge", value: getAddress(crvResult.gaugeAddress) }, { name: "maxLoss", value: 1 }]
    }
  }
  return ERROR_RESPONSE;
}

async function getBalancerGauges(chainId: number): Promise<BalancerGauge[]> {
  // each chain (Mainnet, Arbitrum, Polygon) has their own subgraph:
  // https://docs.balancer.fi/reference/vebal-and-gauges/gauges.html#query-pending-tokens-for-a-given-pool
  const res = await axios.post("https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges", {
    headers: {
      'Content-Type': 'application/json',
    },
    query: `
      {
          liquidityGauges(
              where:{
              isKilled: false,
              }
          ) {
              id,
              poolAddress,
          }
      }
    `,
  });

  return res.data.data.liquidityGauges.map((gauge: { id: Address; poolAddress: Address; }) => {
    return {
      address: getAddress(gauge.id),
      lpToken: getAddress(gauge.poolAddress),
    } as BalancerGauge;
  });
}

async function getCurvePoolData(chainId: number): Promise<PoolData[]> {
  let poolData
  if (!poolData) {
    const main = axios.get(`https://api.curve.fi/api/getPools/ethereum/main`);
    const crypto = axios.get(`https://api.curve.fi/api/getPools/ethereum/crypto`);
    const factory = axios.get(`https://api.curve.fi/api/getPools/ethereum/factory`);
    const factoryCrypto = axios.get(`https://api.curve.fi/api/getPools/ethereum/factory-crypto`);
    const factoryCrvusd = axios.get(`https://api.curve.fi/api/getPools/ethereum/factory-crvusd`);
    const factoryTtricrypto = axios.get(`https://api.curve.fi/api/getPools/ethereum/factory-tricrypto`);

    const responses = await Promise.all([main, crypto, factory, factoryCrypto, factoryCrvusd, factoryTtricrypto]);
    const pools = responses.map((resp) => resp.data);
    poolData = pools.map((pool) => pool.data.poolData).flat();
  }
  return poolData;
}