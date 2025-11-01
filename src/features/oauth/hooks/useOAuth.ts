import { useSelector } from 'react-redux';

import { RootState } from '@/features/app/store/store';

import { OAuthState } from '../models/session/types/OAuthState';

export const useOAuth = () => {
  const oauthState = useSelector((state: RootState) => state.oauth.session);

  return {
    // State
    state: oauthState.state,
    user: oauthState.user,
    currentProvider: oauthState.currentProvider,
    error: oauthState.error,

    // Computed states
    isLoading:
      oauthState.state === OAuthState.LOGGING_IN ||
      oauthState.state === OAuthState.LOGGING_OUT ||
      oauthState.state === OAuthState.INITIALIZING,
    isInitialized: oauthState.state !== OAuthState.NOT_INITIALIZED,
    isAuthenticated: oauthState.state === OAuthState.AUTHENTICATED,
    isLoggingIn: oauthState.state === OAuthState.LOGGING_IN,
    isLoggingOut: oauthState.state === OAuthState.LOGGING_OUT,
    isReady: oauthState.state === OAuthState.READY,
    hasError: oauthState.state === OAuthState.ERROR,
    isInitializing: oauthState.state === OAuthState.INITIALIZING,
  };
};
