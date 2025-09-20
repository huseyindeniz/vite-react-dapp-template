import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

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

    // Store tokens securely
    yield call([authService, authService.storeTokens], session.accessToken, session.refreshToken, providerName);

    yield put(authActions.loginSucceeded({ session, provider: providerName }));
  } catch (error) {
    yield put(authActions.loginFailed({ error: `Login failed: ${error}` }));
  }
}
