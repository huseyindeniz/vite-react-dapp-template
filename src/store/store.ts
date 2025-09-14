import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { authSaga } from '@/features/auth/sagas';
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import {
  watchWalletSaga /*announceWalletLoaded*/,
} from '@/features/wallet/sagas';
import { AuthService } from '@/services/auth/AuthService';
import { GitHubAuthProvider } from '@/services/auth/providers/github/GitHubAuthProvider';
import { GoogleAuthProvider } from '@/services/auth/providers/google/GoogleAuthProvider';

import { EthersV6WalletAPI } from '../services/ethersV6/wallet/WalletAPI';
import { BlogDemoApi } from '../services/jsonplaceholder/BlogDemoApi';

import RootReducer from './rootReducer';

enableMapSet();

const walletApi = EthersV6WalletAPI.getInstance();
const blogDemoApi = BlogDemoApi.getInstance();
const authService = AuthService.getInstance();

// Register auth providers
authService.registerProvider(new GoogleAuthProvider());
authService.registerProvider(new GitHubAuthProvider());

function* RootSaga() {
  yield all([fork(watchWalletSaga, walletApi)]);
  yield all([fork(watchBlogDemoSaga, blogDemoApi)]);
  yield all([fork(authSaga, authService)]);
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
