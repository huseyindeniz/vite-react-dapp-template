import { createAction } from '@reduxjs/toolkit';

import { AuthProviderName } from '../../types/IAuthProvider';

export const loginWithProvider = createAction<{
  provider: AuthProviderName;
}>('auth/loginWithProvider');
export const logout = createAction('auth/logout');
