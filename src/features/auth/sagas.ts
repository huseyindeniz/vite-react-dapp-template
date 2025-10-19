import { takeLatest, put } from 'redux-saga/effects';

import { IAuthService } from '@/features/auth/types/IAuthService';

import { ActionEffectLoginWithProvider } from './models/actionEffects/loginWithProvider';
import { ActionEffectLogout } from './models/actionEffects/logout';
import * as authActions from './models/actions';
import * as sliceActions from './models/slice';
import { AuthState } from './models/types/AuthState';

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
