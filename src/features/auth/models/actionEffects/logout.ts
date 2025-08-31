import { call, put, select } from 'redux-saga/effects';

import { AuthApi } from '@/services/auth';
import { RootState } from '@/store/store';

import { getAuthProviderByName } from '../../config';
import * as authActions from '../actions';

const authApi = new AuthApi();

// Storage keys
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_PROVIDER_KEY = 'auth_provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* ActionEffectLogout(): Generator<any, void, any> {
  try {
    yield put(authActions.logoutStarted());
    
    const state: RootState = yield select();
    const { session, currentProvider } = state.auth;
    
    // Logout from backend
    if (session?.accessToken) {
      try {
        yield call([authApi, 'logout'], session.accessToken);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Backend logout failed:', error);
      }
    }
    
    // Logout from provider
    if (currentProvider) {
      const provider = getAuthProviderByName(currentProvider);
      if (provider) {
        try {
          yield call([provider, 'logout']);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(`Provider ${currentProvider} logout failed:`, error);
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