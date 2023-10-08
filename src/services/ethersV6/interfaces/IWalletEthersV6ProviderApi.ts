import { BrowserProvider } from 'ethers/providers';

import { IWalletAPI } from '../../interfaces/IWalletAPI';

export interface IWalletEthersV6ProviderApi extends IWalletAPI {
  // following methods are needed for using provider and signer in contract services
  getProvider(): BrowserProvider | null;
  getSignerAddress(): string | null;
}
