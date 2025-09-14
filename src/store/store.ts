import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { authSaga } from '@/features/auth/sagas';
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import {
  watchWalletSaga /*announceWalletLoaded*/,
} from '@/features/wallet/sagas';
import { AuthApi } from '@/services/auth/AuthApi';

import { EthersV6WalletAPI } from '../services/ethersV6/wallet/WalletAPI';
import { BlogDemoApi } from '../services/jsonplaceholder/BlogDemoApi';

import RootReducer from './rootReducer';

enableMapSet();

const walletApi = EthersV6WalletAPI.getInstance();
const blogDemoApi = BlogDemoApi.getInstance();
const authApi = AuthApi.getInstance();

function* RootSaga() {
  yield all([fork(watchWalletSaga, walletApi)]);
  yield all([fork(watchBlogDemoSaga, blogDemoApi)]);
  yield all([fork(authSaga, authApi)]);
}

const sagaMiddleware = saga();

const store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: import.meta.env.MODE === 'development',
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
