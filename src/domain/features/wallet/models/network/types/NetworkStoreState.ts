import { LoadingStatusType } from '../../types/LoadingStatus';

import { BlockInfo } from './BlockInfo';
import { Network } from './Network';
import { NetworkLoadState } from './NetworkLoadState';

export type NetworkStoreState = {
  networkLoadState: NetworkLoadState;
  network: Network | null;
  blockInfoLoading: LoadingStatusType;
  blockInfo: BlockInfo | null;
};
