import log from 'loglevel';
import { put, select } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';
import { RootState } from '@/store/store';

import * as sliceActions from '../slice';
import { AuthState } from '../types/AuthState';
import { AuthStoreState } from '../types/AuthStoreState';

export function* ActionEffectLogout(authService: IAuthService) {
  try {
    // Set logging out state
    yield put(sliceActions.setState(AuthState.LOGGING_OUT));
    yield put(sliceActions.setError(null));

    const { currentProvider }: AuthStoreState = yield select(
      (state: RootState) => state.auth.session
    );

    // Logout using the unified auth service - backend handles token validation via httpOnly cookies
    try {
      yield authService.logout(currentProvider || undefined);
    } catch (error) {
      log.debug('Logout failed:', error);
    }

    // Backend clears httpOnly cookies automatically

    // Clear auth state
    yield put(sliceActions.setState(AuthState.READY));
    yield put(sliceActions.setUser(null));
    yield put(sliceActions.setCurrentProvider(null));
  } catch (error) {
    yield put(sliceActions.setState(AuthState.ERROR));
    yield put(sliceActions.setError(`Logout failed: ${error}`));
  }
}
