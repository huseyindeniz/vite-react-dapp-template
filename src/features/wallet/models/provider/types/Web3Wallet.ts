import { SupportedWallets } from '@/services/interfaces/IWalletProviderApi';

export type Web3Wallet = {
  name: SupportedWallets;
  label: string;
  link: string;
};
