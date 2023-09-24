import { ethers } from 'ethers';

import { IWalletAPI } from '../../interfaces/IWalletAPI';

export interface IWalletEthersV5ProviderApi extends IWalletAPI {
  // following methods are needed for using provider and signer in contract services
  getProvider(): ethers.providers.Web3Provider | null;
  getSignerAddress(): string | null;
}
