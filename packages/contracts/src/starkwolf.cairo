use starknet::ContractAddress;


#[starknet::interface]
trait StarkWolfTrait<T> {
    // global methods 
    // fn get_role(self: @T, player_comm: u256) -> Role;
    // fn get_stage(self: @T) -> Stage;

    // init
    // TODO: do we need anything here?

    // registration
    fn register(self: @T, player_comm: u256); // NOTE: must have payment associated
    fn end_registration(self: @T); // NOTE: has a payout associated with it
// werewolf
// fn eliminate(self: @T, player_addr: ContractAddress);

// // voting
// fn vote_and_commit(self: @T, vote_addr: ContractAddress, next_round_comm: u256);
// fn end_voting(self: @T); // NOTE: has a payout associated with it

// // challenge/win
// fn werewolf_challenge(self: @T, proof: u256); // TODO: what this proof is
// fn tanner_win(self: @T, proof: u256); // TODO: what this proof is
// fn start_new_round(self: @T); // NOTE: has a payout associated with it
}

#[starknet::contract]
mod StarkWolf {
    use super::ContractAddress;
    use starknet::get_caller_address;

    use starknet::get_block_info;
    use box::BoxTrait;


    #[storage]
    struct Storage {
        round_block_length: u256,
        round: u256,
        round_start_block: u256, // TODO: presumably round length, etc. defined in constructor
        round_start_blockhash: u256, // NOTE: for use in werewolf/tanner comps
        stage: u256,
        player_comms: LegacyMap::<u256, u256>,
    // NOTE: may want max_players in here too
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_owner: ContractAddress) {
        // self.round_block_length.write(100); // NOTE: 3-4 hrs
        // self.round.write(0);

        let block_info = get_block_info().unbox();
    // TODO: store block info in start_block, start_blockhash
    }

    #[external(v0)]
    impl StarkWolfImpl of super::StarkWolfTrait<ContractState> {
        fn register(
            self: @ContractState, player_comm: u256
        ) { // blockhash + time math to see if registration still open, get player comm in
        }

        fn end_registration(
            self: @ContractState
        ) { // blockhash + time math to see if registration ready to close, close it
        }
    }
}
