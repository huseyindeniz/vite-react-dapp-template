import log from 'loglevel';
import { call, put, select } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';
import { RootState } from '@/store/store';

import * as authActions from '../actions';
import { AuthStoreState } from '../types/AuthStoreState';

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

    // Clear stored tokens
    yield call([authService, authService.clearStoredTokens]);

    yield put(authActions.logoutSucceeded());
  } catch (error) {
    yield put(authActions.logoutFailed({ error: `Logout failed: ${error}` }));
  }
}
