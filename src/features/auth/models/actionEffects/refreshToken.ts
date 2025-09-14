import { call, put, select } from 'redux-saga/effects';

import { IAuthApi } from '@/features/auth/interfaces/IAuthApi';
import { RootState } from '@/store/store';

import * as authActions from '../actions';
import { AuthSession } from '../types/AuthSession';
import { AuthStoreState } from '../types/AuthStoreState';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectRefreshToken(
  authApi: IAuthApi
) {
  try {
    yield put(authActions.tokenRefreshStarted());

    const { session }: AuthStoreState = yield select(
      (state: RootState) => state.auth
    );

    if (!session?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const newSession: AuthSession = yield call(
      [authApi, authApi.refreshToken],
      {
        refreshToken: session.refreshToken,
      }
    );

    // Update storage
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newSession));

    yield put(authActions.tokenRefreshSucceeded({ session: newSession }));
  } catch (error) {
    // Clear invalid session
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);

    yield put(
      authActions.tokenRefreshFailed({
        error: `Token refresh failed: ${error}`,
      })
    );
  }
}
