import { IWalletAccountApi } from './account/IWalletAccountApi';
import { IWalletNetworkApi } from './network/IWalletNetworkApi';
import { IWalletProviderApi } from './provider/IWalletProviderApi';

export interface IWalletAPI
  extends IWalletProviderApi,
    IWalletAccountApi,
    IWalletNetworkApi {}
