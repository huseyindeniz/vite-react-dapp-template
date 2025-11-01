import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import {
  OAuthProviderName,
  OAuthProviderCredentials,
} from '@/features/oauth/types/IOAuthProvider';
import { IOAuthService } from '@/features/oauth/types/IOAuthService';

import * as sliceActions from '../slice';
import { OAuthState } from '../types/OAuthState';
import { OAuthUser } from '../types/OAuthUser';

export function* ActionEffectLoginWithProvider(
  oauthService: IOAuthService,
  action: PayloadAction<{ provider: OAuthProviderName }>
): SagaIterator {
  const { provider: providerName } = action.payload;

  try {
    // Set loading state
    yield put(sliceActions.setState(OAuthState.LOGGING_IN));
    yield put(sliceActions.setCurrentProvider(providerName));
    yield put(sliceActions.setError(null));

    // Step 1: Get provider credentials (immediate user data for UI feedback)
    const credentials: OAuthProviderCredentials = yield call(
      [oauthService, oauthService.getProviderCredentials],
      providerName
    );

    // Step 2: Immediately show user in UI with provider data
    const immediateUser: OAuthUser = {
      id: credentials.sub || `${providerName}_temp`,
      email: credentials.email || '',
      name: credentials.name || '',
      given_name: credentials.given_name || '',
      avatarUrl: credentials.picture || '',
      provider: providerName,
    };

    yield put(sliceActions.setState(OAuthState.AUTHENTICATED));
    yield put(sliceActions.setUser(immediateUser));

    // Step 3: Exchange authorization code with backend for validated user data
    const backendResult: { user: OAuthUser } = yield call(
      [oauthService, oauthService.exchangeTokenWithBackend],
      providerName,
      credentials
    );

    // Step 4: Update UI with authoritative backend user data
    yield put(sliceActions.setUser(backendResult.user));
  } catch (error) {
    yield put(sliceActions.setState(OAuthState.ERROR));
    yield put(sliceActions.setUser(null));
    yield put(sliceActions.setCurrentProvider(null));
    yield put(sliceActions.setError(`Login failed: ${error}`));
  }
}
