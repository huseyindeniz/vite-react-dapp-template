import { useSelector } from 'react-redux';

import { RootState } from '@/core/features/app/store/store';

import { OAuthState } from '../models/session/types/OAuthState';

export const useOAuth = () => {
  const oauthState = useSelector((state: RootState) => state.oauth.session);

  return {
    // Raw state - components check themselves
    state: oauthState.state,
    user: oauthState.user,
    currentProvider: oauthState.currentProvider,
    error: oauthState.error,

    // Computed state - only when checking multiple states
    isLoading:
      oauthState.state === OAuthState.LOGGING_IN ||
      oauthState.state === OAuthState.LOGGING_OUT ||
      oauthState.state === OAuthState.INITIALIZING,
  };
};
