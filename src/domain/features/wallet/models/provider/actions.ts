import { createAction } from '@reduxjs/toolkit';

import { SupportedWallets } from '@/domain/features/wallet/models/provider/types/SupportedWallets';

export const connectWallet = createAction('CONNECT_WALLET');
export const selectWallet = createAction<SupportedWallets>('SELECT_WALLET');
