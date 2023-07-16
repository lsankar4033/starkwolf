import { ec } from "starknet";

const n = ec.starkCurve.CURVE.n;

export const mulmod = (a: bigint, b: bigint): bigint => {
  return (a * b) % n;
};

export const addmod = (a: bigint, b: bigint): bigint => {
  return (a + b) % n;
};

export const submod = (a: bigint, b: bigint): bigint => {
  return (a - b + n) % n;
};

/**
 * @returns A random field element
 */
export const randomFe = (): bigint => {
  const randomFe = BigInt(
    "0x" + Buffer.from(ec.starkCurve.utils.randomPrivateKey()).toString("hex")
  );

  return randomFe;
};

export const pedersenHash = (x: bigint, y: bigint): bigint => {
  const hashStr = ec.starkCurve.pedersen(x, y);
  return BigInt(hashStr) % ec.starkCurve.CURVE.n;
};
