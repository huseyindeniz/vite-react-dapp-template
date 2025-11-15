import { SupportedWallets } from '@/domain/features/wallet/models/provider/types/SupportedWallets';

import { Web3Wallet } from '../models/provider/types/Web3Wallet';
export const Coinbase: Web3Wallet = {
  name: SupportedWallets.COINBASE,
  label: 'Coinbase',
  link: 'https://www.coinbase.com/wallet',
};
