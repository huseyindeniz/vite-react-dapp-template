import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName, AuthProviderCredentials } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthUser } from '../types/AuthUser';

export function* ActionEffectLoginWithProvider(
  authService: IAuthService,
  action: PayloadAction<{ provider: AuthProviderName }>
): SagaIterator {
  const { provider: providerName } = action.payload;

  try {
    yield put(authActions.loginStarted({ provider: providerName }));

    // Step 1: Get provider credentials (immediate user data for UI feedback)
    const credentials: AuthProviderCredentials = yield call(
      [authService, authService.getProviderCredentials],
      providerName
    );

    // Step 2: Immediately show user in UI with provider data
    const immediateUser: AuthUser = {
      id: credentials.sub || `${providerName}_temp`,
      email: credentials.email || '',
      name: credentials.name || '',
      given_name: credentials.given_name || '',
      avatarUrl: credentials.picture || '',
      provider: providerName,
    };

    yield put(authActions.loginSucceeded({
      user: immediateUser,
      provider: providerName
    }));

    // Step 3: Exchange authorization code with backend for validated user data
    const backendResult: { user: AuthUser } = yield call(
      [authService, authService.exchangeTokenWithBackend],
      providerName,
      credentials
    );

    // Step 4: Update UI with authoritative backend user data
    yield put(authActions.userUpdated({
      user: backendResult.user
    }));

  } catch (error) {
    yield put(authActions.loginFailed({ error: `Login failed: ${error}` }));
  }
}
