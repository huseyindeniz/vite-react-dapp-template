import log from 'loglevel';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectRestoreSession(authService: IAuthService) {
  try {
    const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
    const providerName = localStorage.getItem(
      AUTH_PROVIDER_KEY
    ) as AuthProviderName;

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
      yield call([authService, authService.validateSession], session.accessToken);
      yield put(
        authActions.sessionRestored({ session, provider: providerName })
      );
    } catch (error) {
      // Session is invalid, try to refresh
      yield put({ type: authActions.REFRESH_TOKEN });
    }
  } catch (error) {
    // Clear invalid session
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
    log.debug('Session restore failed:', error);
  }
}
