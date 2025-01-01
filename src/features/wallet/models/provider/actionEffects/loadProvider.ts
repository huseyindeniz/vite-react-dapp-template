import { put, call } from 'redux-saga/effects';

import { Coinbase } from '@/features/wallet/web3Wallets/coinbase';
import { Core } from '@/features/wallet/web3Wallets/core';
import { Metamask } from '@/features/wallet/web3Wallets/metamask';
import { Rabby } from '@/features/wallet/web3Wallets/rabby';
import {
  IWalletProviderApi,
  InstalledWallets,
  SupportedWallets,
} from '@/services/interfaces/IWalletProviderApi';

import { SlowDown } from '../../../utils';
import * as accountActions from '../../account/actions';
import * as walletStateSliceActions from '../../slice';
import { LoadingStatusType } from '../../types/LoadingStatus';
import { WalletState } from '../../types/WalletState';
import * as actions from '../actions';
import * as sliceActions from '../slice';
import { ProviderLoadState } from '../types/ProviderLoadState';
import { Web3Wallet } from '../types/Web3Wallet';

// ACTION EFFECTS

export function* ActionEffectLoadProvider(walletApi: IWalletProviderApi) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_WALLET));
  yield call(HandleStateDetectingWallets, walletApi);
}

export function* ActionEffectSelectProvider(
  walletApi: IWalletProviderApi,
  action: ReturnType<typeof actions.selectWallet>
) {
  yield put(walletStateSliceActions.setLoading(LoadingStatusType.PENDING));
  yield put(walletStateSliceActions.setState(WalletState.CHECKING_WALLET));
  const isProviderLoaded: boolean = yield call(
    HandleStateProviderRequested,
    walletApi,
    action.payload
  );
  if (isProviderLoaded) {
    yield put({ type: accountActions.loadAccount.type });
  } else {
    yield put(walletStateSliceActions.setLoading(LoadingStatusType.IDLE));
  }
}

// STATE HANDLERS

export function* HandleStateDetectingWallets(
  walletProviderApi: IWalletProviderApi
) {
  yield put(
    sliceActions.setProviderLoadState(ProviderLoadState.DETECTING_WALLETS)
  );
  try {
    const detectedWallets: InstalledWallets = yield call(
      walletProviderApi.detectWallets
    );
    const detectedProviderCount = Object.keys(detectedWallets).length;
    if (detectedProviderCount === 0) {
      yield call(HandleStateProviderNotSupported);
    }
    if (detectedProviderCount === 1) {
      let singleWallet;
      switch (Object.keys(detectedWallets)[0]) {
        case SupportedWallets.COINBASE:
          singleWallet = Coinbase;
          break;
        case SupportedWallets.CORE:
          singleWallet = Core;
          break;
        case SupportedWallets.METAMASK:
          singleWallet = Metamask;
          break;
        case SupportedWallets.RABBY:
          singleWallet = Rabby;
          break;
      }
      if (singleWallet) {
        yield put(sliceActions.setInstalledWallets([singleWallet]));
        yield put({
          type: actions.selectWallet.type,
          payload: singleWallet?.name,
        });
      } else {
        throw new Error('Wallet can not be loaded');
      }
    }
    if (detectedProviderCount > 1) {
      const installedWallets: Web3Wallet[] = [];
      Object.keys(detectedWallets).map(key => {
        switch (key) {
          case SupportedWallets.METAMASK:
            installedWallets.push(Metamask);
            break;
          case SupportedWallets.CORE:
            installedWallets.push(Core);
            break;
          case SupportedWallets.COINBASE:
            installedWallets.push(Coinbase);
            break;
          case SupportedWallets.RABBY:
            installedWallets.push(Rabby);
            break;
        }
        return null;
      });
      yield put(sliceActions.setInstalledWallets(installedWallets));
      yield put(
        sliceActions.setProviderLoadState(
          ProviderLoadState.WAITING_WALLET_SELECTION
        )
      );
    }
  } catch (error) {
    yield call(
      HandleStateProviderFailed,
      (error as Error).message ?? 'Wallet detection failed'
    );
  }
}

export function* HandleStateProviderRequested(
  walletProviderApi: IWalletProviderApi,
  wallet: SupportedWallets
) {
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.REQUESTED));
  yield call(SlowDown);
  let isProviderLoaded: boolean = false;
  let isError: boolean = false;
  try {
    isProviderLoaded = yield call(walletProviderApi.loadProvider, wallet);
    if (isProviderLoaded) {
      let connectedWallet;
      switch (wallet) {
        case SupportedWallets.METAMASK:
          connectedWallet = Metamask;
          break;
        case SupportedWallets.CORE:
          connectedWallet = Core;
          break;
        case SupportedWallets.COINBASE:
          connectedWallet = Coinbase;
          break;
        case SupportedWallets.RABBY:
          connectedWallet = Rabby;
          break;
      }
      if (connectedWallet) {
        yield put(sliceActions.setConnectedWallet(connectedWallet));
      } else {
        throw new Error('can not connect');
      }
    }
  } catch (error) {
    isProviderLoaded = false;
    isError = true;
  }
  if (isProviderLoaded) {
    yield put(sliceActions.setProviderLoadState(ProviderLoadState.INITIALIZED));
    return true;
  }
  if (isError) {
    yield call(HandleStateProviderFailed, 'Wallet detection failed');
  } else {
    yield call(HandleStateProviderNotSupported);
  }
  return false;
}

export function* HandleStateProviderFailed(error: string) {
  yield put(walletStateSliceActions.setError(error));
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.FAILED));
}

export function* HandleStateProviderNotSupported() {
  yield put(sliceActions.setProviderLoadState(ProviderLoadState.NOT_SUPPORTED));
}
