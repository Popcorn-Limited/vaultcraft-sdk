import { publicClient, walletClient } from "./setup";

export async function increaseTime(seconds: number) {
    await publicClient.increaseTime({
        seconds,
    });
    await publicClient.mine({
        blocks: 1,
    });
    await walletClient.increaseTime({
        seconds,
    });
    await walletClient.mine({
        blocks: 1,
    });
}
