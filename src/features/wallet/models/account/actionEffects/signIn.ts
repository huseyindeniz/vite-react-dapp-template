import log from 'loglevel';
import { END, EventChannel, Task } from 'redux-saga';
import {
  put,
  spawn,
  call,
  delay,
  select,
  cancel,
  take,
} from 'redux-saga/effects';

import { IWalletAccountApi } from '@/features/wallet/interfaces/IWalletAccountApi';
import { RootState } from '@/store/store';

import { DISABLE_WALLET_SIGN, SIGN_TIMEOUT_IN_SEC } from '../../../config';
import { SlowDown } from '../../../utils';
import { connectWallet } from '../../provider/actions';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as actions from '../actions';
import * as slicesActions from '../slice';
import { AccountType } from '../types/Account';
import { AccountSignState } from '../types/AccountSignState';

// ACTION EFFECTS
export function* ActionEffectWaitSignIn() {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_SIGN));
  yield call(HandleStateNotSigned);
}

export function* ActionEffectSignIn(
  walletApi: IWalletAccountApi,
  action: ReturnType<typeof actions.signIn>
) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_SIGN));
  if (DISABLE_WALLET_SIGN) {
    yield put({ type: actions.announceWalletLoaded.type });
    yield call(HandleStateSigned, walletApi);
    yield put(walletStateSliceActions.setState(WalletState.AUTHENTICATED));
    yield call(HandleStateUserAuthenticated, walletApi);
  } else {
    const signResult: boolean = yield call(
      HandleStateSignRequested,
      walletApi,
      action.payload
    );
    if (signResult) {
      yield put(walletStateSliceActions.setState(WalletState.AUTHENTICATED));
      yield call(HandleStateUserAuthenticated, walletApi);
    }
  }
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
}

// STATE HANDLERS

// Cancellable Task Handlers
let taskSign!: Task;

export function* HandleStateNotSigned() {
  yield put(slicesActions.setAccountSignState(AccountSignState.NOT_SIGNED));
}

export function* HandleStateSignRequested(
  walletSignApi: IWalletAccountApi,
  message: string
) {
  let isSigned: boolean = false;
  let error: Error | undefined;
  try {
    yield put(
      slicesActions.setAccountSignState(AccountSignState.SIGN_INITIALIZED)
    );
    yield call(SlowDown);
    const preparedMessage: string = yield call(
      walletSignApi.prepareSignMessage,
      message
    );
    yield put(
      slicesActions.setAccountSignState(AccountSignState.SIGN_REQUESTED)
    );
    yield spawn(CheckSignTimeout);
    yield call(walletSignApi.sign, preparedMessage);
    const walletState: WalletState = yield select(
      (state: RootState) => state.wallet.state.state
    );
    const accountSignState: AccountSignState = yield select(
      (state: RootState) => state.wallet.account.accountSignState
    );
    if (
      walletState === WalletState.CHECKING_SIGN &&
      accountSignState === AccountSignState.SIGN_REQUESTED
    ) {
      isSigned = yield call(walletSignApi.isSigned);
    }
  } catch (e) {
    error = e as Error;
    isSigned = false;
  }
  if (isSigned) {
    yield put({ type: actions.announceWalletLoaded.type });
    yield call(HandleStateSigned, walletSignApi);
    return true;
  }
  if (error?.message === 'sign_rejected') {
    yield call(HandleStateSignRejected);
  } else {
    yield call(HandleStateSignFailed, error?.message || '0');
  }
  return false;
}

export function* CheckSignTimeout() {
  for (let i = SIGN_TIMEOUT_IN_SEC; i > 0; i--) {
    yield delay(1000);
    yield put(slicesActions.decSignCounter());
    const walletState: WalletState = yield select(
      (state: RootState) => state.wallet.state.state
    );
    const accountSignState: AccountSignState = yield select(
      (state: RootState) => state.wallet.account.accountSignState
    );
    if (
      !(
        walletState === WalletState.CHECKING_SIGN &&
        accountSignState === AccountSignState.SIGN_REQUESTED
      )
    ) {
      break;
    }
  }
  const walletState: WalletState = yield select(
    (state: RootState) => state.wallet.state.state
  );
  const accountSignState: AccountSignState = yield select(
    (state: RootState) => state.wallet.account.accountSignState
  );
  if (
    walletState === WalletState.CHECKING_SIGN &&
    accountSignState === AccountSignState.SIGN_REQUESTED
  ) {
    yield call(HandleStateSignTimedout);
  }
  yield put(slicesActions.resetSignCounter());
  yield cancel(taskSign);
}

export function* HandleStateSignRejected() {
  yield put(slicesActions.setAccountSignState(AccountSignState.SIGN_REJECTED));
}

export function* HandleStateSignTimedout() {
  yield put(slicesActions.setAccountSignState(AccountSignState.SIGN_TIMED_OUT));
}

export function* HandleStateSignFailed(error: string) {
  yield put(walletStateSliceActions.setError(error));
  yield put(slicesActions.setAccountSignState(AccountSignState.SIGN_FAILED));
}

export function* HandleStateSigned(walletSignApi: IWalletAccountApi) {
  yield put(slicesActions.setAccountSignState(AccountSignState.SIGNED));
  yield call(SlowDown);
  yield call(SlowDown);
  yield call(SlowDown);
  // store user info
  const accountData: AccountType | null = yield call(walletSignApi.getAccount);
  if (accountData) {
    yield put(slicesActions.setAccount(accountData));
  }
}

export function* HandleStateUserAuthenticated(
  walletAuthenticatedApi: IWalletAccountApi
) {
  yield spawn(handleEventAccountsChanged, walletAuthenticatedApi);
  const isDomainNameSupported: boolean = yield call(
    walletAuthenticatedApi.isDomainNameSupported,
    null
  );
  if (isDomainNameSupported) {
    yield spawn(updateDomainNameWithAPI, walletAuthenticatedApi);
  }
}

// Non-blocking functions
function* updateDomainNameWithAPI(walletAuthenticatedApi: IWalletAccountApi) {
  try {
    const domainName: string | null = yield call(
      walletAuthenticatedApi.getDomainName
    );
    if (domainName) {
      yield put(slicesActions.setAccountDomainName(domainName));
      const avatarURL: string = yield call(
        walletAuthenticatedApi.getAvatarURL,
        domainName
      );
      log.debug(avatarURL);
      if (avatarURL !== '') {
        yield put(slicesActions.setAccountAvatarURL(avatarURL));
      }
    }
  } catch (error) {
    yield put(walletStateSliceActions.setError(error as string));
  }
}

// WalletApi Event Handlers
function* handleEventAccountsChanged(
  walletAuthenticatedApi: IWalletAccountApi
) {
  const channel: EventChannel<string[]> = yield call(
    walletAuthenticatedApi.listenAccountChange
  );
  try {
    while (true) {
      yield take(channel);
      yield put(actions.disconnectWallet());
      yield call(walletAuthenticatedApi.handleAccountChange);
      yield put({ type: connectWallet.type });
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(END.type);
      break;
    }
  } finally {
    channel.close();
  }
}
