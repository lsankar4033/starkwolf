use core::ec::EcPoint;
use core::ec::ec_point_new;
use core::ec::ec_point_zero;
use debug::PrintTrait;
use core::ec::{ec_point_is_zero, ec_mul};
use core::ec::{ec_point_unwrap};
use core::ec::IsZeroResult;
use core::Into;
use core::pedersen;

// !Unsafe generators
const Gx: felt252 = 0x1ef15c18599971b7beced415a40f0c7deacfd9b0d1819e03d723d8bc943cfca;
const Gy: felt252 = 0x5668060aa49730b7be4801df46ec62de53ecd11abe43a32873000c36e8dc1f;
const Hx: felt252 = 0x759ca09377679ecd535a81e83039658bf40959283187c654c5416f439403cf5;
const Hy: felt252 = 0x6f524a3400e7708d5c01a28598ad272e7455aa88778b19f93b562d7a9646c41;

#[derive(Copy, Drop)]
struct AffinePoint {
    x: felt252,
    y: felt252,
}

#[derive(Copy, Drop)]
struct ZKOpeningProof {
    comm: AffinePoint,
    alpha: AffinePoint,
    z1: felt252,
    z2: felt252,
    msg: felt252,
}

#[derive(Copy, Drop)]
struct ZKInequalityProof {
    comm: AffinePoint,
    alpha1: AffinePoint,
    alpha2: AffinePoint,
    z1: felt252,
    z2: felt252,
    xv: felt252,
}

impl AffinePointInto of Into<AffinePoint, EcPoint> {
    fn into(self: AffinePoint) -> EcPoint {
        ec_point_new(self.x, self.y)
    }
}

// Pedersen commitment generators

fn GENS_G() -> EcPoint {
    ec_point_new(Gx, Gy)
}

fn GENS_H() -> EcPoint {
    ec_point_new(Hx, Hy)
}

fn is_equal(a: EcPoint, b: EcPoint) -> bool {
    match ec_point_is_zero(a - b) {
        IsZeroResult::Zero(()) => {
            return true;
        },
        IsZeroResult::NonZero(p) => {
            return false;
        },
    }
}

// Verify zero-knowledge opening proof
fn verify_opening(proof: ZKOpeningProof) -> bool {
    let comm: EcPoint = proof.comm.into();
    let alpha: EcPoint = proof.alpha.into();

    let c1 = pedersen(proof.alpha.x, proof.alpha.y);
    let c = pedersen(proof.msg, c1);

    let lhs = ec_mul(GENS_G(), proof.z1) + ec_mul(GENS_H(), proof.z2);
    let rhs = ec_mul(comm, c) + alpha;

    is_equal(lhs, rhs)
}

// Verify zero-knowledge inequality proof
fn verify_inequality(proof: ZKInequalityProof) -> bool {
    let comm: EcPoint = proof.comm.into();
    let alpha1: EcPoint = proof.alpha1.into();
    let alpha2: EcPoint = proof.alpha2.into();

    let c1 = pedersen(proof.alpha1.x, proof.alpha1.y);
    let c2 = pedersen(proof.alpha2.x, proof.alpha2.y);
    let c = pedersen(c1, c2);

    let lhs = ec_mul(GENS_G(), proof.z1) + ec_mul(GENS_H(), proof.z2);
    let rhs = ec_mul(comm - ec_mul(GENS_G(), proof.xv), c) + alpha1 + alpha2;

    is_equal(lhs, rhs)
}


#[cfg(test)]
mod test {
    use super::{ZKOpeningProof, ZKInequalityProof, AffinePoint, verify_opening, verify_inequality};

    fn valid_opening_proof() -> ZKOpeningProof {
        // Proof generated by the Typescript prover

        let comm = AffinePoint {
            x: 0x743829e0a179f8afe223fc8112dfc8d024ab6b235fd42283c4f5970259ce7b7,
            y: 0xe67a0a63cc493225e45b9178a3375596ea2a1d7012628a328dbc14c78cd1b7
        };
        let alpha = AffinePoint {
            x: 0x483b1d140b680e1ebddb26a03a54ccf5f93f75e2eb9c6c0e323ebb40463c539,
            y: 0x30252d6bfd5c1b16d60e4f6438be5111bbb1497acb434161cb71e395f6174b7
        };

        ZKOpeningProof {
            comm,
            alpha,
            z1: 0x1d69d233de0ddc5e2ece7eeab843a8251c492bd1aa83bae41910ab172f2c7ff,
            z2: 0x68f136cd3eb3e8f41f34549c7ad7c56b0d918c743b549403ffa734cc07b6393,
            msg: 0xd05,
        }
    }

    fn invalid_opening_proof() -> ZKOpeningProof {
        let mut proof = valid_opening_proof();
        proof.z1 = 0xdeadbeef;
        proof
    }

    fn valid_inequality_proof() -> ZKInequalityProof {
        // Proof generated by the Typescript prover

        let comm = AffinePoint {
            x: 0x743829e0a179f8afe223fc8112dfc8d024ab6b235fd42283c4f5970259ce7b7,
            y: 0xe67a0a63cc493225e45b9178a3375596ea2a1d7012628a328dbc14c78cd1b7
        };
        let alpha1 = AffinePoint {
            x: 0x6e8cbde114bdd013f1885a70873d6b9ef435f239b732bc410e3c3a55efec859,
            y: 0x4dbf6a27307db93907e2e031f815e970bfae3eaabe5bae14fba7144a87c3e2f
        };

        let alpha2 = AffinePoint {
            x: 0x5cd7e02d7aa0c718a2f24f550ef8bffa3fc8e5b0fbada384722ef7d6ebba1a8,
            y: 0x472e9a7606465b194e3fce20eda9bb04554ccd672f0eca5cc827fa1aad058b2
        };
        let xv = 0x14;

        ZKInequalityProof {
            comm,
            alpha1,
            alpha2,
            z1: 0x320aaaadcafa7c5450fcdc1ee1e4a89cf5e2d6b406def950beb7e4d992b8ad4,
            z2: 0x63864645e81ec51250d33165c74e82bca04dca8270c3a53f9841c6931cb5db9,
            xv,
        }
    }

    fn invalid_inequality_proof() -> ZKInequalityProof {
        let mut proof = valid_inequality_proof();
        proof.z1 = 0xdeadbeef;
        proof
    }

    // Test `verify_opening`
    // Should return true for valid proof, and false for invalid proof
    #[test]
    fn test_verify_opening() {
        let proof = valid_opening_proof();
        assert(verify_opening(proof) == true, 'valid proof should verify');

        let invalid_proof = invalid_opening_proof();
        assert(verify_opening(invalid_proof) == false, 'should assert invalid proof');
    }

    // Test `verify_inequality`
    // Should return true for valid proof, and false for invalid proof
    #[test]
    fn test_verify_inequality() {
        let proof = valid_inequality_proof();
        assert(verify_inequality(proof) == true, 'valid proof should verify');

        let invalid_proof = invalid_inequality_proof();
        assert(verify_inequality(invalid_proof) == false, 'should assert invalid proof');
    }
}
