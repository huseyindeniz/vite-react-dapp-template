import { BrowserProvider } from 'ethers/providers';

import { IWalletApi } from '@/features/wallet/IWalletApi';

export interface IWalletEthersV6ProviderApi extends IWalletApi {
  // following methods are needed for using provider and signer in contract services
  getProvider: () => BrowserProvider | null;
  getSignerAddress: () => string | null;
}
