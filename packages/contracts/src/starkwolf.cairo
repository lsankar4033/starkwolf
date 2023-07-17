use core::traits::Into;
use starknet::ContractAddress;

use cairo_vote::verifier::{ZKOpeningProof, verify_opening};

#[starknet::interface]
trait StarkWolfTrait<T> {
    // global methods 
    // fn get_role(self: @T, player_comm: u256) -> Role;
    // fn get_stage(self: @T) -> Stage;

    // init
    // TODO: do we need anything here?

    // registration
    fn register(ref self: T, player_comm: u256); // NOTE: must have payment associated
    fn end_registration(ref self: T); // NOTE: has a payout associated with it

    // werewolf elimination phase
    fn eliminate(ref self: T, player_addr: ContractAddress, proof: ZKOpeningProof);
// voting
// fn vote_and_commit(self: @T, vote_addr: ContractAddress, next_round_comm: u256);
// fn end_voting(self: @T); // NOTE: has a payout associated with it

// // challenge/win
// fn werewolf_challenge(self: @T, proof: u256); // TODO: what this proof is
// fn tanner_win(self: @T, proof: u256); // TODO: what this proof is
// fn start_new_round(self: @T); // NOTE: has a payout associated with it
}

#[starknet::contract]
mod StarkWolf {
    use super::{ContractAddress, ZKOpeningProof, verify_opening};

    use starknet::get_caller_address;

    use starknet::get_block_info;
    use box::BoxTrait;

    use array::ArrayTrait;


    #[storage]
    struct Storage {
        round_block_length: u64,
        registration_block_length: u64,
        // TODO: block lengths for each phase

        round: u256,
        round_start_block: u64, // TODO: presumably round length, etc. defined in constructor
        round_start_ts: u64, // NOTE: for use in werewolf/tanner comps
        stage: u256,
        player_comms: LegacyMap::<ContractAddress, u256>,
    // NOTE: may want max_players in here too
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_owner: ContractAddress) {
        self.round_block_length.write(100); // NOTE: 3-4 hrs
        // self.registration_block_length.write(10);

        self.round.write(0);

        let block_info = get_block_info().unbox();
        self.round_start_block.write(block_info.block_number);
        self.round_start_ts.write(block_info.block_timestamp);

        self.stage.write(0);
    }

    impl StarkWolfImpl of super::StarkWolfTrait<ContractState> {
        #[external]
        fn register(ref self: ContractState, player_comm: u256) {
            // TODO: handle registration payment
            assert(self.stage.read() == 0, 'Not in registration phase');

            let addr = get_caller_address();

            // TODO: check that commitment isn't double-used
            self.player_comms.write(addr, player_comm)
        }

        #[external]
        fn end_registration(ref self: ContractState) {
            // TODO: compensate caller
            assert(self.stage.read() == 0, 'Not in registration phase');

            assert(
                get_block_info().unbox().block_number >= self.round_start_block.read()
                    + self.registration_block_length.read(),
                'Registration not over yet'
            );

            self.stage.write(1);
        }

        #[external]
        fn eliminate(ref self: ContractState, player_addr: ContractAddress, proof: ZKOpeningProof) {
            assert(self.stage.read() == 1, 'Not in elimination phase');

            assert(verify_opening(proof), 'Invalid opening proof')
        // TODO: check that proof msg corresponds to addr
        // TODO: 
        }
    }
}
