export type Strategy = {
  name: string;
  key: string;
  logoURI: string;
  protocol: string;
  description: string;
  chains: number[];
  resolver?: string;
  adapter?: string;
};

export type SimulationResponse = {
  request?: any,
  success: boolean,
  error?: string
}

export type StrategyData = {
  id: `0x${string}`,
  data: `0x${string}`
}