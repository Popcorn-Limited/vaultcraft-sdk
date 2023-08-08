import base58 from "bs58";
import { toHex } from "viem";

export function getBytes32FromIpfsHash(ipfsHash: string) {
  const decoded = base58.decode(ipfsHash);
  return toHex(decoded.slice(2));
}

export function getIpfsHashFromBytes32(bytes32Hex: string) {
  const hashHex = "1220" + bytes32Hex.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  return base58.encode(hashBytes);
}