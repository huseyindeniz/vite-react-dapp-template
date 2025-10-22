import { takeLatest, put } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';

import { ActionEffectLoginWithProvider } from './models/session/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/session/actionEffects/logout';
import * as authActions from './models/session/actions';
import * as sliceActions from './models/session/slice';
import { AuthState } from './models/session/types/AuthState';

export function* authSaga(authService: IAuthService) {
  // Initialize auth state when saga starts
  yield put(sliceActions.setState(AuthState.READY));
  yield put(sliceActions.setError(null));

  yield takeLatest(
    authActions.loginWithProvider.type,
    ActionEffectLoginWithProvider,
    authService
  );
  yield takeLatest(authActions.logout.type, ActionEffectLogout, authService);
}
