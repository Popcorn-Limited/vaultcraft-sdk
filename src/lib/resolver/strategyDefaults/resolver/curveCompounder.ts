
const CRV = { 1: "0xD533a949740bb3306d119CC777fa900bA034cd52" }
const CVX = { 1: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B" }

export async function curveCompounder({ chainId, rpcUrl, address, adapter }: { chainId: number, rpcUrl: string, address: string, adapter: string }): Promise<any[]> {
  // @ts-ignore
  const rewardTokens = [CRV[chainId]];
  const baseAsset = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
  const minTradeAmounts = ["0"];
  const optionalData = ["0x"];

  if (adapter === "ConvexAdapter") {
    // @ts-ignore
    rewardTokens.push(CVX[chainId]);
    minTradeAmounts.push("0");
  }

  return [rewardTokens, minTradeAmounts, baseAsset, optionalData]
}
