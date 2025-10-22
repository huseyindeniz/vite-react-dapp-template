import { createAction } from '@reduxjs/toolkit';

import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';

export const connectWallet = createAction('CONNECT_WALLET');
export const selectWallet = createAction<SupportedWallets>('SELECT_WALLET');
