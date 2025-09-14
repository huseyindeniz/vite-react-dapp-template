import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';

import { IAuthApi } from '@/features/auth/interfaces/IAuthApi';

import {
  AuthProviderName,
  AuthProviderCredentials,
} from '../../providers/types/AuthProvider';
import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectLoginWithCredentials(
  authApi: IAuthApi,
  action: PayloadAction<{
    provider: AuthProviderName;
    credentials: AuthProviderCredentials;
  }>
) {
  const { provider: providerName, credentials } = action.payload;

  try {
    yield put(authActions.loginStarted({ provider: providerName }));

    // Exchange credentials with backend
    const tokenType =
      providerName === 'google' ? 'authorization_code' : 'access_token';
    const session: AuthSession = yield call([authApi, authApi.exchangeToken], {
      provider: providerName,
      token: credentials.token,
      tokenType,
      email: credentials.email,
    });

    // Store session
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(AUTH_PROVIDER_KEY, providerName);

    yield put(authActions.loginSucceeded({ session, provider: providerName }));
  } catch (error) {
    yield put(authActions.loginFailed({ error: `Login failed: ${error}` }));
  }
}
