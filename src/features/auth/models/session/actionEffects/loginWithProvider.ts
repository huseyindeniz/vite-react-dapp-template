import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import {
  AuthProviderName,
  AuthProviderCredentials,
} from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as sliceActions from '../slice';
import { AuthState } from '../types/AuthState';
import { AuthUser } from '../types/AuthUser';

export function* ActionEffectLoginWithProvider(
  authService: IAuthService,
  action: PayloadAction<{ provider: AuthProviderName }>
): SagaIterator {
  const { provider: providerName } = action.payload;

  try {
    // Set loading state
    yield put(sliceActions.setState(AuthState.LOGGING_IN));
    yield put(sliceActions.setCurrentProvider(providerName));
    yield put(sliceActions.setError(null));

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

    yield put(sliceActions.setState(AuthState.AUTHENTICATED));
    yield put(sliceActions.setUser(immediateUser));

    // Step 3: Exchange authorization code with backend for validated user data
    const backendResult: { user: AuthUser } = yield call(
      [authService, authService.exchangeTokenWithBackend],
      providerName,
      credentials
    );

    // Step 4: Update UI with authoritative backend user data
    yield put(sliceActions.setUser(backendResult.user));
  } catch (error) {
    yield put(sliceActions.setState(AuthState.ERROR));
    yield put(sliceActions.setUser(null));
    yield put(sliceActions.setCurrentProvider(null));
    yield put(sliceActions.setError(`Login failed: ${error}`));
  }
}
