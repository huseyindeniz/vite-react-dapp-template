import { IWalletAccountApi } from './IWalletAccountApi';
import { IWalletNetworkApi } from './IWalletNetworkApi';
import { IWalletProviderApi } from './IWalletProviderApi';

export interface IWalletAPI
  extends IWalletProviderApi,
    IWalletAccountApi,
    IWalletNetworkApi {}
