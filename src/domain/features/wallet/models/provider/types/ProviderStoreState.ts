import { ProviderLoadState } from './ProviderLoadState';
import { Web3Wallet } from './Web3Wallet';

export type ProviderStoreState = {
  providerLoadState: ProviderLoadState;
  installedWallets: Web3Wallet[];
  connectedWallet: Web3Wallet | null;
};
