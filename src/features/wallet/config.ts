import { Web3Wallet } from './models/provider/types/Web3Wallet';
import { Coinbase } from './web3Wallets/coinbase';
import { Core } from './web3Wallets/core';
import { Metamask } from './web3Wallets/metamask';
import { Rabby } from './web3Wallets/rabby';

export const SUPPORTED_WALLETS: Web3Wallet[] = [
  Metamask,
  Core,
  Coinbase,
  Rabby,
];

export const SIGN_TIMEOUT_IN_SEC: number = import.meta.env
  .VITE_WALLET_SIGN_TIMEOUT_IN_SEC;
export const SLOW_DOWN_IN_MS: number = import.meta.env
  .VITE_WALLET_SLOW_DOWN_IN_MS;
export const DISABLE_WALLET_SIGN: boolean = JSON.parse(
  import.meta.env.VITE_WALLET_DISABLE_SIGN || 'false'
);

export const POST_LOGIN_REDIRECT_PATH: string | undefined =
  import.meta.env.VITE_POST_LOGIN_REDIRECT_PATH || undefined;
