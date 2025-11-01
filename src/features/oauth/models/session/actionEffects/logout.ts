import log from 'loglevel';
import { put, select } from 'redux-saga/effects';

import { RootState } from '@/features/app/store/store';
import { IOAuthService } from '@/features/oauth/types/IOAuthService';

import * as sliceActions from '../slice';
import { OAuthState } from '../types/OAuthState';
import { OAuthStoreState } from '../types/OAuthStoreState';

export function* ActionEffectLogout(authService: IOAuthService) {
  try {
    // Set logging out state
    yield put(sliceActions.setState(OAuthState.LOGGING_OUT));
    yield put(sliceActions.setError(null));

    const { currentProvider }: OAuthStoreState = yield select(
      (state: RootState) => state.oauth.session
    );

    // Logout using the unified auth service - backend handles token validation via httpOnly cookies
    try {
      yield authService.logout(currentProvider || undefined);
    } catch (error) {
      log.debug('Logout failed:', error);
    }

    // Backend clears httpOnly cookies automatically

    // Clear auth state
    yield put(sliceActions.setState(OAuthState.READY));
    yield put(sliceActions.setUser(null));
    yield put(sliceActions.setCurrentProvider(null));
  } catch (error) {
    yield put(sliceActions.setState(OAuthState.ERROR));
    yield put(sliceActions.setError(`Logout failed: ${error}`));
  }
}
