import { createAction } from '@reduxjs/toolkit';

import { OAuthProviderName } from '../provider/types/OAuthProviderName';

export const loginWithProvider = createAction<{
  provider: OAuthProviderName;
}>('auth/loginWithProvider');
export const logout = createAction('auth/logout');
