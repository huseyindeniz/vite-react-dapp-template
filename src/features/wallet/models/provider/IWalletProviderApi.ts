import { ethers } from 'ethers';

export interface IWalletProviderApi {
  loadProvider(): Promise<boolean>;
  // following methods are needed for using provider and signer in contract services
  getProvider(): ethers.providers.Web3Provider | null;
  getSigner(): string | null;
}
