import { ethers } from 'ethers';

export interface IWalletEthersV5ProviderApi {
  // following methods are needed for using provider and signer in contract services
  getProvider(): ethers.providers.Web3Provider | null;
  getSignerAddress(): string | null;
}
