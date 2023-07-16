import {
  proveOpening,
  verifyOpening,
  proveInequality,
  verifyInequality,
  GENS,
  pedersenCommit
} from "../lib/proofs";

describe("Test proofs", () => {
  const x = BigInt(3);
  const r = BigInt(2);
  const C = pedersenCommit(x, r, GENS);
  describe("proveOpening", () => {
    it("should be able to prove opening", () => {
      const proof = proveOpening(C, x, r, GENS);
      expect(verifyOpening(proof, GENS)).toBeTruthy();
    });

    it("should assert invalid opening proof", () => {
      const proof = proveOpening(C, x, r, GENS);
      proof.z1 += BigInt(1);
      expect(verifyOpening(proof, GENS)).toBeFalsy();
    });
  });

  describe("proveInequality", () => {
    it("should be able to prove inequality", () => {
      const xv = BigInt(20);
      const proof = proveInequality(C, x, xv, r, GENS);
      expect(verifyInequality(proof, GENS)).toBeTruthy();
    });

    it("should assert invalid inequality proof", () => {
      const xv = BigInt(20);
      const proof = proveInequality(C, x, xv, r, GENS);
      proof.z1 += BigInt(1);
      expect(verifyInequality(proof, GENS)).toBeFalsy();
    });

    it("should assert if x = xv", () => {
      const xv = x;
      const proof = proveInequality(C, x, xv, r, GENS);
      expect(verifyInequality(proof, GENS)).toBeFalsy();
    });
  });
});
