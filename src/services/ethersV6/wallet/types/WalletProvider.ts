import { Eip1193Provider } from 'ethers/providers';

/**
 * Extended Eip1193Provider type with wallet-specific identification properties.
 * Different wallet providers inject their own identification properties.
 */
export interface WalletProvider extends Eip1193Provider {
  // MetaMask identification
  isMetaMask?: boolean;

  // Rabby Wallet identification
  isRabby?: boolean;

  // Coinbase Wallet identification
  isCoinbaseWallet?: boolean;

  // Core Wallet identification (Avalanche)
  coreProvider?: {
    isAvalanche?: boolean;
  };
}
