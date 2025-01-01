import { BrowserProvider } from 'ethers';

export enum SupportedWallets {
  METAMASK = 'metamask',
  CORE = 'core',
  COINBASE = 'coinbase',
  RABBY = 'rabby',
}

export type InstalledWallets = Record<SupportedWallets, BrowserProvider>;

export interface IWalletProviderApi {
  detectWallets: () => Promise<InstalledWallets>;
  loadProvider: (wallet: SupportedWallets) => Promise<boolean>;
}
