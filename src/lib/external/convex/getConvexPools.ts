import axios from "axios";
import { Address } from "viem";

export type ConvexPool = {
  poolid: BigInt;
  active: boolean;
  lpToken: Address;
  crvApr: string;
  cvxApr: string;
}

export default async function getConvexPools(): Promise<ConvexPool[]> {
  const res = await axios.post("https://api.thegraph.com/subgraphs/name/convex-community/convex", {
    headers: {
      'Content-Type': 'application/json',
    },
    query: `
    {
        pools {
        poolid
        active
        lpToken
        crvApr
        cvxApr
        }
    }
    `,
  });
  return res.data.data.pools;
}