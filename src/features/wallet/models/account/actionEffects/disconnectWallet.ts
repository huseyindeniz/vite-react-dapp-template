import { call, put } from 'redux-saga/effects';

import { IAccountApi } from '@/features/wallet/models/account/IAccountApi';

import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';

export function* ActionEffectDisconnectWallet(walletApi: IAccountApi) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield call(HandleStateDisconnectRequested, walletApi);
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
}

export function* HandleStateDisconnectRequested(
  walletAccountApi: IAccountApi
) {
  try {
    yield call(walletAccountApi.reset);
  } catch (error) {
    yield put(walletStateSliceActions.setError((error as Error).message));
  }
}
