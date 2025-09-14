import { SupportedWallets } from '@/features/wallet/interfaces/IWalletProviderApi';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';

export const Core: Web3Wallet = {
  name: SupportedWallets.CORE,
  label: 'Core',
  link: 'https://core.app',
};
