import { GENS, pedersenCommit } from '@/lib/proofs';
import { useContext } from 'react';
import { PlayerContext } from '@/pages/_app';
import { IPlayerContext } from '@/types';
import { pedersenHash } from '@/lib/utils';

// Submit the hiding commitment of the public key to the contract
export const useJoinGame = () => {
  // Obtain the blinding value of the Pedersen commitment by signing
  // the gameId
  const { player } = useContext(PlayerContext) as IPlayerContext;

  const joinGame = async (gameId: bigint) => {
    if (player) {
      const r = pedersenHash(gameId, BigInt(player.secret));
      const comm = pedersenCommit(BigInt(player?.pubKey), r, GENS);

      // TODO: Submit the commitment to the contract
    }
  };

  return {
    joinGame,
  };
};
