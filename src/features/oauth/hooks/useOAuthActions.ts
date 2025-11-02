import { useCallback } from 'react';

import { OAuthProviderName } from '../models/provider/types/OAuthProviderName';

import { useActions } from './useActions';

export const useOAuthActions = () => {
  const actions = useActions();

  const loginWith = useCallback(
    (provider: OAuthProviderName) => {
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
