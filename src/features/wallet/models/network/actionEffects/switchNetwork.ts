import { put, call } from 'redux-saga/effects';

import { IWalletApi } from '@/features/wallet/interfaces/IWalletApi';
import { INetworkApi } from '@/features/wallet/models/network/interfaces/INetworkApi';

import { SlowDown } from '../../../utils';
import * as providerActions from '../../provider/actions';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as actions from '../actions';
import * as slicesActions from '../slice';
import { NetworkLoadState } from '../types/NetworkLoadState';

export function* ActionEffectSwitchNetwork(
  walletApi: IWalletApi,
  action: ReturnType<typeof actions.switchNetwork>
) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_NETWORK));
  const networkSwitchResult: boolean = yield call(
    HandleStateNetworkSwitchRequested,
    action.payload,
    walletApi
  );
  if (networkSwitchResult) {
    // ethers needs to reconstruct provider
    yield put({ type: providerActions.connectWallet.type });
  }
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
}

export function* HandleStateNetworkSwitchRequested(
  networkId: number,
  walletNetworkApi: INetworkApi
) {
  try {
    yield put(
      slicesActions.setNetworkLoadState(
        NetworkLoadState.NETWORK_SWITCH_REQUESTED
      )
    );
    yield call(SlowDown);
    const isNetworkSwitched: boolean = yield call(
      walletNetworkApi.switchNetwork,
      networkId
    );
    if (!isNetworkSwitched) {
      throw new Error('Network switch failed');
    }
    return true;
  } catch (error) {
    const errorMessage: string = (error as Error).message;
    if (errorMessage === 'switch_rejected') {
      yield call(HandleStateNetworkSwitchRejected);
    } else {
      yield call(HandleStateNetworkSwitchFailed, errorMessage);
    }
    return false;
  }
}

export function* HandleStateNetworkSwitchRejected() {
  yield put(walletStateSliceActions.setError('Network switch rejected'));
  yield put(
    slicesActions.setNetworkLoadState(NetworkLoadState.NETWORK_SWITCH_REJECTED)
  );
}

export function* HandleStateNetworkSwitchFailed(error: string) {
  yield put(walletStateSliceActions.setError(error));
  yield put(
    slicesActions.setNetworkLoadState(NetworkLoadState.NETWORK_SWITCH_FAILED)
  );
}
