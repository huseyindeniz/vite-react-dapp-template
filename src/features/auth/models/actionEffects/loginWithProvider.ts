import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';

import { AuthApi, AuthSession } from '@/services/auth';

import { getAuthProviderByName } from '../../config';
import { AuthProvider, AuthProviderName, AuthProviderCredentials } from '../../providers/types/AuthProvider';
import * as authActions from '../actions';

const authApi = new AuthApi();

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectLoginWithProvider(action: PayloadAction<{ provider: AuthProviderName }>) {
  const { provider: providerName } = action.payload;
  
  try {
    yield put(authActions.loginStarted({ provider: providerName }));
    
    const provider: AuthProvider = getAuthProviderByName(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    
    if (!provider.isAvailable()) {
      throw new Error(`Provider ${providerName} is not available`);
    }
    
    // Get credentials from provider
    const credentials: AuthProviderCredentials = yield call([provider, 'login']);
    
    // Exchange with backend
    const session: AuthSession = yield call([authApi, 'exchangeToken'], {
      provider: providerName,
      token: credentials.token,
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