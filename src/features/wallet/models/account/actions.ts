import { createAction } from '@reduxjs/toolkit';

export const loadAccount = createAction('LOAD_ACCOUNT');
export const unlockWallet = createAction('UNLOCK_WALLET');
export const waitSignIn = createAction<string>('WAIT_SIGN_IN');
export const signIn = createAction<string>('SIGN_IN');
export const disconnectWallet = createAction('DISCONNECT_WALLET');
export const announceWalletLoaded = createAction('ANNOUNCE_WALLET_LOADED');
