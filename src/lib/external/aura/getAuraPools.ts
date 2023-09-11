import axios from 'axios';

export interface AuraPool {
  id: string;
  isShutdown: boolean;
  aprs: {
    total: number;
    breakdown: {
      id: string;
      token: {
        symbol: string;
        name: string;
        address: string;
      };
      name: string;
      value: number;
    }[];
  };
  lpToken: {
    address: string;
  };
}

export default async function getAuraPools(chainId: number): Promise<AuraPool[]> {
  const res = await axios.post('https://data.aura.finance/graphql', {
    headers: {
      'Content-Type': 'application/json',
    },
    query: `
      query Pools($chainId: Int = 1) {
        pools(chainId: $chainId){
          id
          lpToken
          {
            address
          }
          aprs {
            total
            breakdown {
              id
              token{
                symbol
                name
                address
              }
            name
            value
            }
          }
        }
      }
    `,
    variables: {
      chainId: chainId,
    },
  });
  return res.data.data.pools;
}