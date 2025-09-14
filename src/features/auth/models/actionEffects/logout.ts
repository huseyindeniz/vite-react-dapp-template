import log from 'loglevel';
import { call, put, select } from 'redux-saga/effects';

import { IAuthApi } from '@/features/auth/interfaces/IAuthApi';
import { RootState } from '@/store/store';

import { getAuthProviderByName } from '../../config';
import * as authActions from '../actions';
import { AuthStoreState } from '../types/AuthStoreState';

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

export function* ActionEffectLogout(authApi: IAuthApi) {
  try {
    yield put(authActions.logoutStarted());

    const { session, currentProvider }: AuthStoreState = yield select(
      (state: RootState) => state.auth
    );

    // Logout from backend
    if (session?.accessToken) {
      try {
        yield call([authApi, authApi.logout], session.accessToken);
      } catch (error) {
        log.debug('Backend logout failed:', error);
      }
    }

    // Logout from provider
    if (currentProvider) {
      const provider = getAuthProviderByName(currentProvider);
      if (provider) {
        try {
          yield call([provider, provider.logout]);
        } catch (error) {
          log.debug(`Provider ${currentProvider} logout failed:`, error);
        }
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
