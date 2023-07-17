import { Player } from '@/types';
import { formatHex } from '@/utils';
import { useSignTypedData } from '@starknet-react/core';
import { WeierstrassSignatureType, ec } from 'starknet';

const message = {
  types: {
    StarkNetDomain: [
      { name: 'name', type: 'felt' },
      { name: 'version', type: 'felt' },
      { name: 'chainId', type: 'felt' },
    ],
    Message: [{ name: 'message', type: 'felt' }],
  },
  primaryType: 'Message',
  domain: {
    name: 'StarkWolf',
    version: '0',
    chainId: 1,
  },
  message: {
    message: 'Sign in',
  },
};

export const useSignIn = () => {
  const { signTypedData } = useSignTypedData(message);

  const signIn = async (): Promise<Player> => {
    const sig = await signTypedData();
    const secret = (sig as WeierstrassSignatureType).s.toString(16);
    const pubKey = Buffer.from(ec.starkCurve.getPublicKey(secret)).toString('hex');

    return {
      pubKey: formatHex(pubKey),
      secret: formatHex(secret),
    };
  };

  return {
    signIn,
  };
};
