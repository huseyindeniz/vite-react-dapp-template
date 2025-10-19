import { useCallback } from 'react';

import { AuthProviderName } from '../types/IAuthProvider';

import { useActions } from './useActions';

export const useAuthActions = () => {
  const actions = useActions();

  const loginWith = useCallback(
    (provider: AuthProviderName) => {
      actions.loginWithProvider({ provider });
    },
    [actions]
  );

  const logout = useCallback(() => {
    actions.logout();
  }, [actions]);

  return {
    loginWith,
    logout,
  };
};
