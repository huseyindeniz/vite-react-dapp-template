import { IAccountApi } from '../models/account/interfaces/IAccountApi';
import { INetworkApi } from '../models/network/interfaces/INetworkApi';
import { IProviderApi } from '../models/provider/interfaces/IProviderApi';

export interface IWalletApi extends IProviderApi, IAccountApi, INetworkApi {}
