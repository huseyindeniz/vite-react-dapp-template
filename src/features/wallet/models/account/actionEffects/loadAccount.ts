import { put, call } from 'redux-saga/effects';

import { IAccountApi } from '@/features/wallet/models/account/IAccountApi';

import { SlowDown } from '../../../utils';
import * as networkActions from '../../network/actions';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as slicesActions from '../slice';
import { AccountLoadState } from '../types/AccountLoadState';

// ACTION EFFECTS
export function* ActionEffectLoadAccount(walletApi: IAccountApi) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_ACCOUNT));
  const isUnlocked: boolean = yield call(
    HandleStateAccountRequested,
    walletApi
  );
  if (isUnlocked) {
    yield put({ type: networkActions.loadNetwork.type });
  } else {
    yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
  }
}

// STATE HANDLERS
export function* HandleStateAccountRequested(
  walletAccountApi: IAccountApi
) {
  yield put(
    slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_REQUESTED)
  );
  yield call(SlowDown);
  let isUnlocked: boolean = false;
  try {
    isUnlocked = yield call(walletAccountApi.isUnlocked);
  } catch (error) {
    isUnlocked = false;
  }
  if (isUnlocked) {
    yield put(
      slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_LOADED)
    );
    return true;
  }
  yield call(HandleStateLocked);
  return false;
}

export function* HandleStateLocked() {
  yield put(slicesActions.setAccountLoadState(AccountLoadState.LOCKED));
}
