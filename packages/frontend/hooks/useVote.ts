import { useContext } from 'react';
import { GENS, pedersenCommit, proveOpening } from '@/lib/proofs';
import { PlayerContext } from '@/pages/_app';
import { IPlayerContext } from '@/types';
import { pedersenHash } from '@/lib/utils';

export const useSubmitVote = () => {
  const { player } = useContext(PlayerContext) as IPlayerContext;

  const submitVote = async (gameId: bigint, voteFor: bigint) => {
    if (player) {
      // Send transaction to vote
      const playerSecret = BigInt(player.secret);
      const playerPubKey = BigInt(player.pubKey);

      const blinder = pedersenHash(gameId, BigInt(player.secret));
      const comm = pedersenCommit(playerPubKey, playerSecret, GENS);
      const vote = proveOpening(comm, playerPubKey, blinder, voteFor, GENS);

      // TODO: Submit vote to the contract
    }
  };

  return {
    submitVote,
  };
};
