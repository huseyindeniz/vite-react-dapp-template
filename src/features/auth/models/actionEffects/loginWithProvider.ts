import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectLoginWithProvider(
  authService: IAuthService,
  action: PayloadAction<{ provider: AuthProviderName }>
) {
  const { provider: providerName } = action.payload;

  try {
    yield put(authActions.loginStarted({ provider: providerName }));

    // Use the high-level loginWithProvider method that handles the entire flow
    const session: AuthSession = yield call(
      [authService, authService.loginWithProvider],
      providerName
    );

    // Store session
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(AUTH_PROVIDER_KEY, providerName);

    yield put(authActions.loginSucceeded({ session, provider: providerName }));
  } catch (error) {
    yield put(authActions.loginFailed({ error: `Login failed: ${error}` }));
  }
}
