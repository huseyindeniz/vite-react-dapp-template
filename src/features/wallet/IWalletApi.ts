import { IAccountApi } from './models/account/IAccountApi';
import { INetworkApi } from './models/network/INetworkApi';
import { IProviderApi } from './models/provider/IProviderApi';

export interface IWalletApi extends IProviderApi, IAccountApi, INetworkApi {}
