import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import {
  watchWalletSaga /*announceWalletLoaded*/,
} from '@/features/wallet/sagas';

/*
If you need to use Ethers V5, 
just uninstall ethers and install ethers v5
npm uninstall ethers
npm i ethers@5.*
use EthersV5WalletAPI in this file
*/
// import { EthersV5WalletAPI } from '../services/ethersV5/wallet/WalletAPI';
import { EthersV6WalletAPI } from '../services/ethersV6/wallet/WalletAPI';

import RootReducer from './rootReducer';

enableMapSet();

// const walletApi = EthersV5WalletAPI.getInstance();
const walletApi = EthersV6WalletAPI.getInstance();

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
