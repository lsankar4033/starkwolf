import { Hex } from '@/types';
import { useEffect, useState } from 'react';

export const useActivate = (playerPubKey?: Hex) => {
  const [isActivated, setIsActivated] = useState<boolean | null>(null);

  const activate = async () => {
    if (playerPubKey) {
      // TODO: Submit playerPubKey to the contract
    }
  };

  useEffect(() => {
    if (playerPubKey) {
      // TODO: Check if the playerPubKey is registered in the contract or not
      setIsActivated(false);
    }
  }, [playerPubKey]);

  return {
    activate,
    isActivated,
  };
};
