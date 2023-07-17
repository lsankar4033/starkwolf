import { AffinePoint } from './lib/types';

export type Hex = `0x${string}`;

export type Player = {
  pubKey: Hex;
  secret: Hex;
};

export type IPlayerContext = {
  player?: Player;
  signIn: () => void;
};

export type Game = {
  id: bigint;
  participants: AffinePoint[];
};
