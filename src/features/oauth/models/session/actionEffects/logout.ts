import log from 'loglevel';
import { put, select } from 'redux-saga/effects';

import { RootState } from '@/features/app/store/store';
import { IOAuthApi } from '@/features/oauth/interfaces/IOAuthApi';

import * as sliceActions from '../slice';
import { OAuthState } from '../types/OAuthState';
import { OAuthStoreState } from '../types/OAuthStoreState';

export function* ActionEffectLogout(oauthApi: IOAuthApi) {
  try {
    // Set logging out state
    yield put(sliceActions.setState(OAuthState.LOGGING_OUT));
    yield put(sliceActions.setError(null));

    const { currentProvider }: OAuthStoreState = yield select(
      (state: RootState) => state.oauth.session
    );

    // Logout using the unified OAuth service - backend handles token validation via httpOnly cookies
    try {
      yield oauthApi.logout(currentProvider || undefined);
    } catch (error) {
      log.debug('Logout failed:', error);
    }

    // Backend clears httpOnly cookies automatically

    // Clear OAuth state
    yield put(sliceActions.setState(OAuthState.READY));
    yield put(sliceActions.setUser(null));
    yield put(sliceActions.setCurrentProvider(null));
  } catch (error) {
    yield put(sliceActions.setState(OAuthState.ERROR));
    yield put(sliceActions.setError(`Logout failed: ${error}`));
  }
}
