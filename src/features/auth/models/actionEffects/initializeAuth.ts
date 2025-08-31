import { call, put } from 'redux-saga/effects';

import { getAuthProviderByName } from '../../config';
import * as authActions from '../actions';

export function* ActionEffectInitializeAuth() {
  try {
    // Initialize all auth providers
    const providers = [getAuthProviderByName('google')].filter(Boolean);
    
    for (const provider of providers) {
      try {
        yield call([provider, 'initialize']);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Failed to initialize ${provider.name} provider:`, error);
      }
    }
    
    yield put(authActions.authInitialized());
    
    // Try to restore session after initialization
    yield put({ type: authActions.RESTORE_SESSION });
  } catch (error) {
    yield put(authActions.authError({ error: `Failed to initialize auth: ${error}` }));
  }
}