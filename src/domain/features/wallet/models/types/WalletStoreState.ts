import { LoadingStatusType } from './LoadingStatus';
import { WalletState } from './WalletState';

export type WalletStoreState = {
  loading: LoadingStatusType;
  error: string | null;
  state: WalletState;
};
