import { put, call } from "redux-saga/effects";

import { SlowDown } from "../../../utils";
import * as accountActions from "../../account/actions";
import { IWalletAPI } from "../../IWalletAPI";
import * as walletStateSliceActions from "../../slice";
import { LoadingStatusType } from "../../types/LoadingStatus";
import { WalletState } from "../../types/WalletState";
import * as actions from "../actions";
import { IWalletNetworkApi } from "../IWalletNetworkApi";
import * as slicesActions from "../slice";
import { NetworkLoadState } from "../types/NetworkLoadState";

export function* ActionEffectSwitchNetwork(
  walletApi: IWalletAPI,
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
    yield put(walletStateSliceActions.setState(WalletState.CHECKING_SIGN));
    // TODO: dispatch an action instead of calling state handler below
    yield put({ type: accountActions.waitSignIn });
  }
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
}

export function* HandleStateNetworkSwitchRequested(
  networkId: number,
  walletNetworkApi: IWalletNetworkApi
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
      throw new Error("Network switch failed");
    }
    yield put({ type: actions.loadNetwork.type });
    return true;
  } catch (error) {
    const errorMessage: string = (error as Error).message;
    if (errorMessage === "switch_rejected") {
      yield call(HandleStateNetworkSwitchRejected);
    } else {
      yield call(HandleStateNetworkSwitchFailed, errorMessage);
    }
    return false;
  }
}

export function* HandleStateNetworkSwitchRejected() {
  yield put(walletStateSliceActions.setError("Network switch rejected"));
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
