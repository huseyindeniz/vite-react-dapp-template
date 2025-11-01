import { createAction } from '@reduxjs/toolkit';

import { OAuthProviderName } from '../../types/IOAuthProvider';

export const loginWithProvider = createAction<{
  provider: OAuthProviderName;
}>('auth/loginWithProvider');
export const logout = createAction('auth/logout');
