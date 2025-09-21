import { SupportedWallets } from '@/features/wallet/interfaces/IWalletProviderApi';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';

export const Rabby: Web3Wallet = {
  name: SupportedWallets.RABBY,
  label: 'Rabby',
  link: 'https://rabby.io/',
};
