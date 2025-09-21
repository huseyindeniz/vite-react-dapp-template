import { SupportedWallets } from '@/features/wallet/interfaces/IWalletProviderApi';

export type Web3Wallet = {
  name: SupportedWallets;
  label: string;
  link: string;
};
