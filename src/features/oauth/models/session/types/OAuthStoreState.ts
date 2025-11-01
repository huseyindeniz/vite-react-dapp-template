import { OAuthProviderName } from '../../../types/IOAuthProvider';

import { OAuthState } from './OAuthState';
import { OAuthUser } from './OAuthUser';

export interface OAuthStoreState {
  state: OAuthState;
  user: OAuthUser | null;
  currentProvider: OAuthProviderName | null;
  error: string | null;
}

export const initialOAuthState: OAuthStoreState = {
  state: OAuthState.NOT_INITIALIZED,
  user: null,
  currentProvider: null,
  error: null,
};
