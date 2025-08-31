import { call, put, select } from 'redux-saga/effects';

import { AuthApi, AuthSession } from '@/services/auth';
import { RootState } from '@/store/store';

import * as authActions from '../actions';

const authApi = new AuthApi();

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* ActionEffectRefreshToken(): Generator<any, void, any> {
  try {
    yield put(authActions.tokenRefreshStarted());
    
    const state: RootState = yield select();
    const { session } = state.auth;
    
    if (!session?.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const newSession: AuthSession = yield call([authApi, 'refreshToken'], {
      refreshToken: session.refreshToken,
    });
    
    // Update storage
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newSession));
    
    yield put(authActions.tokenRefreshSucceeded({ session: newSession }));
  } catch (error) {
    // Clear invalid session
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
    
    yield put(authActions.tokenRefreshFailed({ error: `Token refresh failed: ${error}` }));
  }
}