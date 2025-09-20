import { call, put } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';

export function* ActionEffectRefreshToken(
  authService: IAuthService
) {
  try {
    yield put(authActions.tokenRefreshStarted());

    // Get stored tokens to access refresh token
    const { refreshToken, provider } = yield call([authService, authService.getStoredTokens]);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const newSession: AuthSession = yield call(
      [authService, authService.refreshToken],
      {
        refreshToken,
      }
    );

    // Update stored tokens with new tokens
    if (provider) {
      yield call([authService, authService.storeTokens], newSession.accessToken, newSession.refreshToken, provider);
    }

    yield put(authActions.tokenRefreshSucceeded({ session: newSession }));
  } catch (error) {
    // Clear invalid tokens
    yield call([authService, authService.clearStoredTokens]);

    yield put(
      authActions.tokenRefreshFailed({
        error: `Token refresh failed: ${error}`,
      })
    );
  }
}
