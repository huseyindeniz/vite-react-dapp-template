import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';

export type Web3Wallet = {
  name: SupportedWallets;
  label: string;
  link: string;
};
