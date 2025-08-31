import { call, put } from 'redux-saga/effects';

import { AuthApi, AuthSession } from '@/services/auth';

import { AuthProviderName } from '../../providers/types/AuthProvider';
import * as authActions from '../actions';

const authApi = new AuthApi();

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectRestoreSession() {
  try {
    const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
    const providerName = localStorage.getItem(AUTH_PROVIDER_KEY) as AuthProviderName;
    
    if (!sessionData || !providerName) {
      return;
    }
    
    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (session.expiresAt <= Date.now()) {
      yield put({ type: authActions.REFRESH_TOKEN });
      return;
    }
    
    // Validate session with backend
    try {
      yield call([authApi, 'validateSession'], session.accessToken);
      yield put(authActions.sessionRestored({ session, provider: providerName }));
    } catch (error) {
      // Session is invalid, try to refresh
      yield put({ type: authActions.REFRESH_TOKEN });
    }
  } catch (error) {
    // Clear invalid session
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
    // eslint-disable-next-line no-console
    console.warn('Session restore failed:', error);
  }
}