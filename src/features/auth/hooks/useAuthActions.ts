import { useCallback } from 'react';

import {
  AuthProviderName,
  AuthProviderCredentials,
} from '../providers/types/AuthProvider';

import { useActions } from './useActions';

export const useAuthActions = () => {
  const actions = useActions();

  const initialize = useCallback(() => {
    actions.initializeAuth();
  }, [actions]);

  const loginWith = useCallback(
    (provider: AuthProviderName) => {
      actions.loginWithProvider({ provider });
    },
    [actions]
  );

  const loginWithCredentials = useCallback(
    (provider: AuthProviderName, credentials: AuthProviderCredentials) => {
      actions.loginWithCredentials({ provider, credentials });
    },
    [actions]
  );

  const logout = useCallback(() => {
    actions.logout();
  }, [actions]);

  const refreshToken = useCallback(() => {
    actions.refreshToken();
  }, [actions]);

  const restoreSession = useCallback(() => {
    actions.restoreSession();
  }, [actions]);

  return {
    initialize,
    loginWith,
    loginWithCredentials,
    logout,
    refreshToken,
    restoreSession,
  };
};
