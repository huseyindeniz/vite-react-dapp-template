import { EventChannel } from 'redux-saga';

import { Network } from '@/domain/features/wallet/models/network/types/Network';

export interface INetworkApi {
  loadNetwork: () => Promise<Network | undefined>;
  getNetwork: () => Network | undefined;
  switchNetwork: (networkId: number) => Promise<boolean>;
  listenNetworkChange: () => EventChannel<string> | undefined;
  handleNetworkChange: () => Promise<void>;
  getLatestBlock: () => Promise<number | undefined>;
  getBalance: () => Promise<string>;
}
