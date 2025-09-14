import { takeLatest } from 'redux-saga/effects';

import { IWalletAPI } from './interfaces/IWalletAPI';
import { ActionEffectDisconnectWallet } from './models/account/actionEffects/disconnectWallet';
import { ActionEffectLoadAccount } from './models/account/actionEffects/loadAccount';
import {
  ActionEffectSignIn,
  ActionEffectWaitSignIn,
} from './models/account/actionEffects/signIn';
import { ActionEffectUnlockWallet } from './models/account/actionEffects/unlockWallet';
import * as accountActions from './models/account/actions';
import { ActionEffectLatestBlock } from './models/network/actionEffects/latestBlock';
import { ActionEffectLoadNetwork } from './models/network/actionEffects/loadNetwork';
import { ActionEffectSwitchNetwork } from './models/network/actionEffects/switchNetwork';
import * as networkActions from './models/network/actions';
import {
  ActionEffectLoadProvider,
  ActionEffectSelectProvider,
} from './models/provider/actionEffects/loadProvider';
import * as providerActions from './models/provider/actions';

// ACTION EFFECTS
export function* watchWalletSaga(walletApi: IWalletAPI) {
  yield takeLatest(
    providerActions.connectWallet.type,
    ActionEffectLoadProvider,
    walletApi
  );
  yield takeLatest(
    providerActions.selectWallet.type,
    ActionEffectSelectProvider,
    walletApi
  );
  yield takeLatest(
    accountActions.loadAccount.type,
    ActionEffectLoadAccount,
    walletApi
  );
  yield takeLatest(
    accountActions.unlockWallet.type,
    ActionEffectUnlockWallet,
    walletApi
  );
  yield takeLatest(
    networkActions.loadNetwork.type,
    ActionEffectLoadNetwork,
    walletApi
  );
  yield takeLatest(
    networkActions.switchNetwork.type,
    ActionEffectSwitchNetwork,
    walletApi
  );
  yield takeLatest(accountActions.waitSignIn.type, ActionEffectWaitSignIn);
  yield takeLatest(accountActions.signIn.type, ActionEffectSignIn, walletApi);
  yield takeLatest(
    accountActions.disconnectWallet.type,
    ActionEffectDisconnectWallet,
    walletApi
  );
  yield takeLatest(
    networkActions.latestBlock.type,
    ActionEffectLatestBlock,
    walletApi
  );
}
