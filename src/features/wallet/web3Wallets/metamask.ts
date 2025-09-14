import { SupportedWallets } from '@/features/wallet/interfaces/IWalletProviderApi';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';

export const Metamask: Web3Wallet = {
  name: SupportedWallets.METAMASK,
  label: 'Metamask',
  link: 'https://metamask.io',
};
