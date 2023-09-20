import { Address } from "viem";
import { Yield } from "src/yieldOptions/types.js";
import { Clients, IProtocol, getEmptyYield } from "./index.js";
import axios from "axios";

const STARGATE_LP_STAKING_ADDRESS = { 1: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b", 42161: "0xeA8DfEE1898a7e0a59f7527F076106d7e44c2176" }

// @dev Make sure the keys here are correct checksum addresses
const STG_ADDRESS = { 1: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6", 42161: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6" }

interface Pool {
  chain: string;
  project: string;
  underlyingTokens: string[];
  apy: number;
}

const networkMap = {
  1: "Ethereum",
  42161: "Arbitrum",
  137: "Polygon"
}; // TODO is there some viem native function that we can use here?

export class Stargate implements IProtocol {
  private clients: Clients;
  constructor(clients: Clients) {
    this.clients = clients;
  }

  async getApy(chainId: number, asset: Address): Promise<Yield> {
    if (chainId !== 1) throw new Error("Stargate is only supported on Ethereum mainnet");

    const client = this.clients[chainId];
    if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);

    const token = await client.readContract({
      address: asset,
      abi: sTokenAbi,
      functionName: "token"
    });
    const pools = (await axios.get("https://yields.llama.fi/pools")).data;

    const filteredPools: Pool[] = pools.data.filter((pool: Pool) => pool.chain === networkMap[chainId] && pool.project === "stargate")
    const pool = filteredPools.find(pool => pool.underlyingTokens[0].toLowerCase() === token.toLowerCase())

    return pool ? {
      total: Number(pool.apy),
      apy: [{
        rewardToken: STG_ADDRESS[chainId],
        apy: Number(pool.apy),
      }],
    } : getEmptyYield(asset);
  }

  async getAssets(chainId: number): Promise<Address[]> {
    if (chainId !== 1) throw new Error("Stargate is only supported on Ethereum mainnet");

    const client = this.clients[chainId];
    if (!client) throw new Error(`Missing public client for chain ID: ${chainId}`);

    const poolLength = await client.readContract({
      address: STARGATE_LP_STAKING_ADDRESS[chainId] as Address,
      abi: lpStakingAbi,
      functionName: "poolLength"
    });

    const tokens = await client.multicall({
      contracts: Array(Number(poolLength)).fill(undefined).map((item, idx) => {
        return {
          address: STARGATE_LP_STAKING_ADDRESS[chainId] as Address,
          abi: lpStakingAbi,
          functionName: "poolInfo",
          args: [idx]
        }
      })
    });

    return tokens.filter(token => token.status === "success").map((token: any) => token.result[0]) as Address[];
  }
}

const lpStakingAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "poolInfo",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "lpToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allocPoint",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastRewardBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "accStargatePerShare",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

const sTokenAbi = [
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;