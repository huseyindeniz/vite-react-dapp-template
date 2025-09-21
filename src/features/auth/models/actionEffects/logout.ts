import log from 'loglevel';
import { put, select } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';
import { RootState } from '@/store/store';

import * as authActions from '../actions';
import { AuthStoreState } from '../types/AuthStoreState';


export function* ActionEffectLogout(authService: IAuthService) {
  try {
    yield put(authActions.logoutStarted());

    const { currentProvider }: AuthStoreState = yield select(
      (state: RootState) => state.auth
    );

    // Logout using the unified auth service - backend handles token validation via httpOnly cookies
    try {
      yield authService.logout(currentProvider || undefined);
    } catch (error) {
      log.debug('Logout failed:', error);
    }

    // Backend clears httpOnly cookies automatically

    yield put(authActions.logoutSucceeded());
  } catch (error) {
    yield put(authActions.logoutFailed({ error: `Logout failed: ${error}` }));
  }
}
