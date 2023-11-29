import axios from "axios";

export interface AuraPool {
  id: string;
  isShutdown: boolean;
  aprs: {
    total: number;
    breakdown: {
      // there are cases where only `id` is defined.
      id: string;
      token?: {
        symbol: string;
        name: string;
        address: string;
      };
      name?: string;
      value?: number;
    }[];
  };
  lpToken: {
    address: string;
  };
}

export default async function getAuraPools(chainId: number): Promise<AuraPool[]> {
  const res = await axios({
    url: "https://data.aura.finance/graphql",
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
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
    })
  });
  return res.data.data.pools
}