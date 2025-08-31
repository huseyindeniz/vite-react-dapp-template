import { takeEvery } from 'redux-saga/effects';

import { ActionEffectInitializeAuth } from './models/actionEffects/initializeAuth';
import { ActionEffectLoginWithProvider } from './models/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/actionEffects/logout';
import { ActionEffectRefreshToken } from './models/actionEffects/refreshToken';
import { ActionEffectRestoreSession } from './models/actionEffects/restoreSession';
import * as authActions from './models/actions';

export function* authSaga() {
  yield takeEvery(authActions.INITIALIZE_AUTH, ActionEffectInitializeAuth);
  yield takeEvery(authActions.LOGIN_WITH_PROVIDER, ActionEffectLoginWithProvider);
  yield takeEvery(authActions.LOGOUT, ActionEffectLogout);
  yield takeEvery(authActions.REFRESH_TOKEN, ActionEffectRefreshToken);
  yield takeEvery(authActions.RESTORE_SESSION, ActionEffectRestoreSession);
}