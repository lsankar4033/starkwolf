import { InjectedConnector, StarknetConfig, useProvider } from '@starknet-react/core';
import type { AppProps } from 'next/app';
import { provider } from 'starknet';
import { createContext, useState } from 'react';
import { Player, IPlayerContext } from '../types';
import { useSignIn } from '../hooks/useSignIn';

export const PlayerContext = createContext<IPlayerContext | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' } }),
    new InjectedConnector({ options: { id: 'argentX' } }),
  ];
  const [player, setPlayer] = useState<Player>();

  const { signIn: _signIn } = useSignIn();

  const signIn = async () => {
    const account = await _signIn();
    setPlayer(account);
  };

  return (
    <StarknetConfig autoConnect connectors={connectors}>
      <PlayerContext.Provider
        value={{
          player,
          signIn,
        }}
      >
        <Component {...pageProps} />
      </PlayerContext.Provider>
    </StarknetConfig>
  );
}
