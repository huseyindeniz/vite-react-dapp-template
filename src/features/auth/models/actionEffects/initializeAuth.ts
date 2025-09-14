import log from 'loglevel';
import { put } from 'redux-saga/effects';

import * as authActions from '../actions';

export function* ActionEffectInitializeAuth() {
  try {
    log.debug('ActionEffectInitializeAuth started');

    // Don't initialize providers here - they will be initialized lazily when needed
    // This prevents conflicts between multiple auth providers

    yield put(authActions.authInitialized());

    // Try to restore session after initialization
    yield put({ type: authActions.RESTORE_SESSION });
  } catch (error) {
    yield put(
      authActions.authError({ error: `Failed to initialize auth: ${error}` })
    );
  }
}
