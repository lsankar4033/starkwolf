use starknet::ContractAddress;

enum Role {
    Wolf: (),
    Villager: (),
    Tanner: ()
}

enum Stage {
    Registration: (),
    Werewolf: (),
    Voting: (),
    Challenge: (),
    End: ()
}

#[starknet::interface]
trait StarkWolf<T> {
    // TODO: remove
    fn transfer_ownership(ref self: T, new_owner: ContractAddress);
    fn get_owner(self: @T) -> ContractAddress;

    // global methods 
    fn get_role(self: @T, player_comm: u256) -> Role;
    fn get_stage(self: @T) -> Stage;

    // registration
    fn register(self: @T, player_comm: u256); // NOTE: must have payment associated
    fn end_registration(self: @T); // NOTE: has a payout associated with it

    // werewolf
    fn eliminate(self: @T, player_addr: ContractAddress);

    // voting
    fn vote_and_commit(self: @T, vote_addr: ContractAddress, next_round_comm: u256);
    fn end_voting(self: @T); // NOTE: has a payout associated with it

    // challenge/win
    fn werewolf_challenge(self: @T, proof: u256); // TODO: what this proof is
    fn tanner_win(self: @T, proof: u256); // TODO: what this proof is
    fn start_new_round(self: @T); // NOTE: has a payout associated with it
}
