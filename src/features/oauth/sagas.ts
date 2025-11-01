import { takeLatest, put } from 'redux-saga/effects';

import { IOAuthService } from '@/features/oauth/types/IOAuthService';

import { ActionEffectLoginWithProvider } from './models/session/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/session/actionEffects/logout';
import * as oauthActions from './models/session/actions';
import * as sliceActions from './models/session/slice';
import { OAuthState } from './models/session/types/OAuthState';

export function* oauthSaga(authService: IOAuthService) {
  // Initialize auth state when saga starts
  yield put(sliceActions.setState(OAuthState.READY));
  yield put(sliceActions.setError(null));

  yield takeLatest(
    oauthActions.loginWithProvider.type,
    ActionEffectLoginWithProvider,
    authService
  );
  yield takeLatest(oauthActions.logout.type, ActionEffectLogout, authService);
}
