import { put, call } from 'redux-saga/effects';

import { IWalletProviderApi } from '@/services/interfaces/IWalletProviderApi';

import { SlowDown } from '../../../utils';
import * as actions from '../../account/actions';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as sliceActions from '../slice';
import { ProviderLoadState } from '../types/ProviderLoadState';

// ACTION EFFECTS

export function* ActionEffectLoadProvider(walletApi: IWalletProviderApi) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_WALLET));
  const isProviderLoaded: boolean = yield call(
    HandleStateProviderRequested,
    walletApi
  );
  if (isProviderLoaded) {
    yield put({ type: actions.loadAccount.type });
  } else {
    yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
  }
}

// STATE HANDLERS

export function* HandleStateProviderRequested(
  walletProviderApi: IWalletProviderApi
) {
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.REQUESTED));
  yield call(SlowDown);
  let isProviderLoaded: boolean = false;
  let isError: boolean = false;
  try {
    isProviderLoaded = yield call(walletProviderApi.loadProvider);
  } catch (error) {
    isProviderLoaded = false;
    isError = true;
  }
  if (isProviderLoaded) {
    yield put(sliceActions.setProviderLoadState(ProviderLoadState.INITIALIZED));
    return true;
  } else {
    if (isError) {
      yield call(HandleStateProviderFailed, 'Wallet detection failed');
    } else {
      yield call(HandleStateProviderNotSupported);
    }
    return false;
  }
}

export function* HandleStateProviderFailed(error: string) {
  yield put(walletStateSliceActions.setError(error));
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.FAILED));
}

export function* HandleStateProviderNotSupported() {
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.NOT_SUPPORTED));
}
