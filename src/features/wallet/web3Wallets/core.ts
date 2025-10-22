import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';

export const Core: Web3Wallet = {
  name: SupportedWallets.CORE,
  label: 'Core',
  link: 'https://core.app',
};
