import { takeLatest, call } from 'redux-saga/effects';

import { IAuthApi } from '@/features/auth/interfaces/IAuthApi';

import { ActionEffectInitializeAuth } from './models/actionEffects/initializeAuth';
import { ActionEffectLoginWithCredentials } from './models/actionEffects/loginWithCredentials';
import { ActionEffectLoginWithProvider } from './models/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/actionEffects/logout';
import { ActionEffectRefreshToken } from './models/actionEffects/refreshToken';
import { ActionEffectRestoreSession } from './models/actionEffects/restoreSession';
import * as authActions from './models/actions';

export function* authSaga(authApi: IAuthApi) {
  // Initialize auth automatically when saga starts
  yield call(ActionEffectInitializeAuth);

  yield takeLatest(authActions.INITIALIZE_AUTH, ActionEffectInitializeAuth);
  yield takeLatest(
    authActions.LOGIN_WITH_PROVIDER,
    ActionEffectLoginWithProvider,
    authApi
  );
  yield takeLatest(
    authActions.loginWithCredentials.type,
    ActionEffectLoginWithCredentials,
    authApi
  );
  yield takeLatest(authActions.LOGOUT, ActionEffectLogout, authApi);
  yield takeLatest(
    authActions.REFRESH_TOKEN,
    ActionEffectRefreshToken,
    authApi
  );
  yield takeLatest(
    authActions.RESTORE_SESSION,
    ActionEffectRestoreSession,
    authApi
  );
}
