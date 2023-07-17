import { ec} from "starknet"
type ProjectivePointType =  ec.starkCurve.ProjectivePoint;

export type AffinePoint = {
    x: bigint;
    y: bigint;
  };
  
export  type Gens = {
    g: ProjectivePointType;
    h: ProjectivePointType;
  };


export   type ZKOpeningProof = {
    comm: AffinePoint;
    alpha: AffinePoint;
    z1: bigint;
    z2: bigint;
    msg: bigint;
  };
  
export   type ZKInequalityProof = {
    comm: AffinePoint;
    alpha1: AffinePoint;
    alpha2: AffinePoint;
    z1: bigint;
    z2: bigint;
    xv: bigint;
  };
  
export   type Vote = {
    proof: ZKOpeningProof;
  };
  
export   type Howl = {
    proof: ZKInequalityProof;
  };