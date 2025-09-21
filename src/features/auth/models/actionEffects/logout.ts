import log from 'loglevel';
import { put, select } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';
import { RootState } from '@/store/store';

import * as authActions from '../actions';
import { AuthStoreState } from '../types/AuthStoreState';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectLogout(authService: IAuthService) {
  try {
    yield put(authActions.logoutStarted());

    const { session, currentProvider }: AuthStoreState = yield select(
      (state: RootState) => state.auth
    );

    if (!session || !currentProvider) {
      throw new Error('No active session to logout from');
    }
    // Logout using the unified auth service
    if (session?.accessToken) {
      try {
        yield authService.logout(session.accessToken, currentProvider);
      } catch (error) {
        log.debug('Logout failed:', error);
      }
    }

    // Clear storage
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);

    yield put(authActions.logoutSucceeded());
  } catch (error) {
    yield put(authActions.logoutFailed({ error: `Logout failed: ${error}` }));
  }
}
