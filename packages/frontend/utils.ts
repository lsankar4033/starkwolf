import { Hex } from './types';

export const formatHex = (str: string): Hex => {
  return `0x${str.replace('0x', '')}`;
};
