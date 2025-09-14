import { takeLatest, call } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';

import { ActionEffectInitializeAuth } from './models/actionEffects/initializeAuth';
import { ActionEffectLoginWithProvider } from './models/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/actionEffects/logout';
import { ActionEffectRefreshToken } from './models/actionEffects/refreshToken';
import { ActionEffectRestoreSession } from './models/actionEffects/restoreSession';
import * as authActions from './models/actions';

export function* authSaga(authService: IAuthService) {
  // Initialize auth automatically when saga starts
  yield call(ActionEffectInitializeAuth);

  yield takeLatest(authActions.INITIALIZE_AUTH, ActionEffectInitializeAuth);
  yield takeLatest(
    authActions.LOGIN_WITH_PROVIDER,
    ActionEffectLoginWithProvider,
    authService
  );
  yield takeLatest(authActions.LOGOUT, ActionEffectLogout, authService);
  yield takeLatest(
    authActions.REFRESH_TOKEN,
    ActionEffectRefreshToken,
    authService
  );
  yield takeLatest(
    authActions.RESTORE_SESSION,
    ActionEffectRestoreSession,
    authService
  );
}
