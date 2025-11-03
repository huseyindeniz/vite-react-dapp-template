import { takeLatest, put } from 'redux-saga/effects';

import { IOAuthApi } from '@/features/oauth/interfaces/IOAuthApi';

import { ActionEffectLoginWithProvider } from './models/session/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/session/actionEffects/logout';
import * as oauthActions from './models/session/actions';
import * as sliceActions from './models/session/slice';
import { OAuthState } from './models/session/types/OAuthState';

export function* oauthSaga(oauthApi: IOAuthApi) {
  // Initialize OAuth state when saga starts
  yield put(sliceActions.setState(OAuthState.READY));
  yield put(sliceActions.setError(null));

  yield takeLatest(
    oauthActions.loginWithProvider.type,
    ActionEffectLoginWithProvider,
    oauthApi
  );
  yield takeLatest(oauthActions.logout.type, ActionEffectLogout, oauthApi);
}
