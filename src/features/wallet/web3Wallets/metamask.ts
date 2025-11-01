import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';

export const Metamask: Web3Wallet = {
  name: SupportedWallets.METAMASK,
  label: 'Metamask',
  link: 'https://metamask.io',
};
