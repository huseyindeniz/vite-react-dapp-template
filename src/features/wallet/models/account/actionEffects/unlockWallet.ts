import log from 'loglevel';
import { put, call, select } from 'redux-saga/effects';

import { IWalletApi } from '@/features/wallet/IWalletApi';
import { IAccountApi } from '@/features/wallet/models/account/IAccountApi';
import { RootState } from '@/store/store';

import { SlowDown } from '../../../utils';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as actions from '../actions';
import * as slicesActions from '../slice';
import { AccountLoadState } from '../types/AccountLoadState';

export function* ActionEffectUnlockWallet(walletApi: IWalletApi) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_ACCOUNT));
  const unlockResult: boolean = yield call(
    HandleStateUnlockRequested,
    walletApi
  );
  if (unlockResult) {
    yield put({ type: actions.loadAccount.type });
  } else {
    yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
  }
}

export function* HandleStateLocked() {
  yield put(slicesActions.setAccountLoadState(AccountLoadState.LOCKED));
}

export function* HandleStateUnlockRequested(
  walletAccountApi: IAccountApi
) {
  yield put(
    slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REQUESTED)
  );
  yield call(SlowDown);
  let isUnlocked: boolean = false;
  let isRejected: boolean = false;
  let isWaiting: boolean = false;
  try {
    yield call(walletAccountApi.unlock);
    const walletState: WalletState = yield select(
      (state: RootState) => state.wallet.state.state
    );
    const accountLoadState: AccountLoadState = yield select(
      (state: RootState) => state.wallet.account.accountLoadState
    );
    if (
      walletState === WalletState.CHECKING_ACCOUNT &&
      accountLoadState === AccountLoadState.UNLOCK_REQUESTED
    ) {
      isUnlocked = yield call(walletAccountApi.isUnlocked);
    }
  } catch (error: unknown) {
    log.debug(error);
    const strError: string = error instanceof Error ? error.message : '';
    if (strError.match(/unlock_rejected/i)) {
      isRejected = true;
    }
    if (strError.match(/already processing/i)) {
      isWaiting = true;
    }
    isUnlocked = false;
  }
  if (isUnlocked) {
    yield put(
      slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_LOADED)
    );
    return true;
  }
  if (isRejected) {
    yield call(HandleStateUnlockRejected);
  } else if (isWaiting) {
    yield call(HandleStateUnlockWaiting);
  } else {
    yield call(HandleStateUnlockFailed);
  }
  return false;
}

export function* HandleStateUnlockRejected() {
  yield put(
    slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REJECTED)
  );
}

export function* HandleStateUnlockWaiting() {
  yield put(
    slicesActions.setAccountLoadState(AccountLoadState.WAITING__UNLOCK)
  );
}
export function* HandleStateUnlockFailed() {
  yield put(slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_FAILED));
}
