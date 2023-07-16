// #############################################################
// Implements proof generation and verification described in:
// #############################################################

import { ec } from "starknet";
import { addmod, mulmod, submod, randomFe, pedersenHash } from "./utils";
import {
  AffinePoint,
  Gens,
  ZKInequalityProof,
  ZKOpeningProof,
  Vote,
  Howl
} from "./types";

const ProjectivePoint = ec.starkCurve.ProjectivePoint;
const StarkCurve = ec.starkCurve.CURVE;

//!Unsafe generators
// TODO: Use StarkNet's generators?
export const GENS: Gens = {
  g: ProjectivePoint.fromAffine({
    x: StarkCurve.Gx,
    y: StarkCurve.Gy
  }),
  h: ProjectivePoint.fromAffine({
    x: StarkCurve.Gx,
    y: StarkCurve.Gy
  }).multiply(BigInt(2))
};

/**
 *
 * @param x Value to commit to
 * @param r Blinding factor
 * @param gens Pedersen commitment generators
 * @returns Pedersen commitment
 */
export const pedersenCommit = (x: bigint, r: bigint, gens: Gens): AffinePoint =>
  gens.g.multiply(x).add(gens.h.multiply(r)).toAffine();

/**                                 
 * Implements https://hackmd.io/aawHYPrZTZynijs8FcUTgQ
 * @param C Pedersen commitment to the user's public key (gens.g * x + gens.h * r)
 * @param x The user's public key
 * @param xv The public key to prove inequality against
 * @param gens Pedersen commitment generators
 * @returns ZK inequality proof
 */
export const proveInequality = (
  C: AffinePoint,
  x: bigint,
  xv: bigint,
  r: bigint,
  gens: Gens
): ZKInequalityProof => {
  const t1 = randomFe();
  const t2 = randomFe();

  const alpha1 = gens.g.multiply(t1).toAffine();
  const alpha2 = gens.h.multiply(t2).toAffine();

  const c1 = pedersenHash(alpha1.x, alpha1.y);
  const c2 = pedersenHash(alpha2.x, alpha2.y);
  const c = pedersenHash(c1, c2);

  const z1 = addmod(t1, mulmod(c, submod(x, xv)));
  const z2 = addmod(t2, mulmod(c, r));

  return {
    comm: C,
    alpha1,
    alpha2,
    z1,
    z2,
    xv
  };
};

/**
 *
 * @param C Pedersen commitment to the user's public key (gens.g * x + gens.h * r)
 * @param x The user's public key
 * @param r Blinding factor in the commitment
 * @param gens Pedersen commitment generators
 * @returns ZK opening proof
 */
export const proveOpening = (
  C: AffinePoint,
  x: bigint,
  r: bigint,
  gens: Gens
): ZKOpeningProof => {
  const t1 = randomFe();
  const t2 = randomFe();

  const alpha = gens.g.multiply(t1).add(gens.h.multiply(t2)).toAffine();

  const c = pedersenHash(alpha.x, alpha.y);

  const cx = mulmod(c, x);
  const z1 = addmod(t1, cx);

  const cr = mulmod(c, r);
  const z2 = addmod(t2, cr);

  return {
    comm: C,
    alpha,
    z1,
    z2
  };
};

export const verifyOpening = (proof: ZKOpeningProof, gens: Gens): boolean => {
  const { comm, alpha, z1, z2 } = proof;

  const lhs = gens.g.multiply(z1).add(gens.h.multiply(z2)).toAffine();

  const c = pedersenHash(alpha.x, alpha.y);

  const rhs = ProjectivePoint.fromAffine(comm)
    .multiply(c)
    .add(ProjectivePoint.fromAffine(alpha));

  return lhs.x === rhs.x && lhs.y === rhs.y;
};

/**
 * Implements https://hackmd.io/aawHYPrZTZynijs8FcUTgQ
 */
export const verifyInequality = (
  proof: ZKInequalityProof,
  gens: Gens
): boolean => {
  const { comm, xv, z1, z2 } = proof;
  const alpha1 = ProjectivePoint.fromAffine(proof.alpha1);
  const alpha2 = ProjectivePoint.fromAffine(proof.alpha2);

  const lhs = gens.g.multiply(z1).add(gens.h.multiply(z2)).toAffine();

  const c1 = pedersenHash(alpha1.x, alpha1.y);
  const c2 = pedersenHash(alpha2.x, alpha2.y);
  const c = pedersenHash(c1, c2);

  const rhs = ProjectivePoint.fromAffine(comm)
    .subtract(gens.g.multiply(xv))
    .multiply(c)
    .add(alpha1)
    .add(alpha2);

  const check1 = lhs.x === rhs.x && lhs.y === rhs.y;

  const g_z1 = gens.g.multiply(z1).toAffine();
  const check2 = alpha1.x !== g_z1.x && alpha1.y !== g_z1.y;

  return check1 && check2;
};

export const vote = (
  userPubKeyComm: AffinePoint,
  userPubKey: bigint,
  r: bigint,
  targetPubKey: bigint
): Vote => {
  // Generate a proof that you know a public key that is a signature of the target public key
  const proof = proveOpening(userPubKeyComm, userPubKey, r, GENS);

  return {
    targetPubKey,
    proof
  };
};

/**
 *
 * @param userPubKeyComm The commitment to the user(werewolf)'s public key
 * @param userPubKey  The user(werewolf)'s public key
 * @param r The blinding factor in the commitment
 * @param targetPubKey The public key to prove inequality against
 */
export const howl = (
  userPubKeyComm: AffinePoint,
  userPubKey: bigint,
  r: bigint,
  targetPubKey: bigint
): Howl => {
  // Generate a proof of non-equivalence
  const proof = proveInequality(
    userPubKeyComm,
    userPubKey,
    r,
    targetPubKey,
    GENS
  );

  return {
    proof
  };
};
