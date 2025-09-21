import { createAction } from '@reduxjs/toolkit';

import { SupportedWallets } from '@/features/wallet/interfaces/IWalletProviderApi';

export const connectWallet = createAction('CONNECT_WALLET');
export const selectWallet = createAction<SupportedWallets>('SELECT_WALLET');
