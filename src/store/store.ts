import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import {
  watchWalletSaga /*announceWalletLoaded*/,
} from '@/features/wallet/sagas';

import { EthersV5WalletAPI } from '../services/ethersV5/wallet/WalletAPI';

import RootReducer from './rootReducer';

enableMapSet();

const walletApi = EthersV5WalletAPI.getInstance();

function* RootSaga() {
  yield all([fork(watchWalletSaga, walletApi)]);
}

const sagaMiddleware = saga();

const store = configureStore({
  reducer: RootReducer,
  middleware: [sagaMiddleware],
  devTools: import.meta.env.MODE === 'development',
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
