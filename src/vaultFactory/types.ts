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
  request: any | undefined,
  success: boolean,
  error: string | undefined
}

export type StrategyData = {
  id: `0x${string}`,
  data: `0x${string}`
}