import { AuthProviderName } from '../../types/IAuthProvider';

import { AuthState } from './AuthState';
import { AuthUser } from './AuthUser';

export interface AuthStoreState {
  state: AuthState;
  user: AuthUser | null;
  currentProvider: AuthProviderName | null;
  error: string | null;
}

export const initialAuthState: AuthStoreState = {
  state: AuthState.NOT_INITIALIZED,
  user: null,
  currentProvider: null,
  error: null,
};
