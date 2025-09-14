import { AuthProviderName } from '../../providers/types/AuthProvider';

import { AuthSession } from './AuthSession';
import { AuthState } from './AuthState';

export interface AuthStoreState {
  state: AuthState;
  session: AuthSession | null;
  currentProvider: AuthProviderName | null;
  error: string | null;
  isInitialized: boolean;
  isLoading: boolean;
}

export const initialAuthState: AuthStoreState = {
  state: AuthState.NOT_INITIALIZED,
  session: null,
  currentProvider: null,
  error: null,
  isInitialized: false,
  isLoading: false,
};
