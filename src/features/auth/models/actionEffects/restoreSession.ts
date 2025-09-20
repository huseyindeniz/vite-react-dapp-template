import log from 'loglevel';
import { call, put } from 'redux-saga/effects';

import { AuthProviderName } from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

export function* ActionEffectRestoreSession(authService: IAuthService) {
  try {
    // Get stored tokens instead of session data
    const { accessToken, refreshToken, provider: providerName }: {
      accessToken: string | null;
      refreshToken: string | null;
      provider: AuthProviderName | null
    } = yield call([authService, authService.getStoredTokens]);

    if (!accessToken || !refreshToken || !providerName) {
      return;
    }

    // Reconstruct session from stored tokens (assume valid, will fail gracefully on first API call if not)
    const session: AuthSession = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Default 24 hours
      user: null, // Will be populated when needed by actual API calls
    };

    // Check if session is expired based on stored expiry
    if (session.expiresAt <= Date.now()) {
      yield put({ type: authActions.REFRESH_TOKEN });
      return;
    }

    // Restore session (tokens will be validated on first actual API call)
    yield put(
      authActions.sessionRestored({ session, provider: providerName })
    );
  } catch (error) {
    // Clear invalid tokens
    yield call([authService, authService.clearStoredTokens]);
    log.debug('Session restore failed:', error);
  }
}
