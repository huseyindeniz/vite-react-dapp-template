import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthUser } from '../types/AuthUser';

export function* ActionEffectLoginWithProvider(
  authService: IAuthService,
  action: PayloadAction<{ provider: AuthProviderName }>
) {
  const { provider: providerName } = action.payload;

  try {
    yield put(authActions.loginStarted({ provider: providerName }));

    // Get user info from provider login + backend sets httpOnly cookies
    const authResult: { user: AuthUser } = yield call(
      [authService, authService.loginWithProvider],
      providerName
    );

    // Login completed - store only user info, backend handles tokens via httpOnly cookies
    yield put(authActions.loginSucceeded({
      user: authResult.user,
      provider: providerName
    }));
  } catch (error) {
    yield put(authActions.loginFailed({ error: `Login failed: ${error}` }));
  }
}
