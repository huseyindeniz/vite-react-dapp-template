import { SupportedWallets } from '@/domain/features/wallet/models/provider/types/SupportedWallets';

export type Web3Wallet = {
  name: SupportedWallets;
  label: string;
  link: string;
};
