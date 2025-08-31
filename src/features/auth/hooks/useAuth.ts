import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';

import { AuthState } from '../models/types/AuthState';

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);

  return {
    // State
    state: authState.state,
    session: authState.session,
    user: authState.session?.user,
    currentProvider: authState.currentProvider,
    error: authState.error,
    isInitialized: authState.isInitialized,
    isLoading: authState.isLoading,

    // Computed states
    isAuthenticated: authState.state === AuthState.AUTHENTICATED,
    isLoggingIn: authState.state === AuthState.LOGGING_IN,
    isLoggingOut: authState.state === AuthState.LOGGING_OUT,
    isReady: authState.state === AuthState.READY,
    hasError: authState.state === AuthState.ERROR,
    isInitializing: authState.state === AuthState.INITIALIZING,

    // Token info
    accessToken: authState.session?.accessToken,
    isTokenExpired: authState.session ? authState.session.expiresAt <= Date.now() : false,
  };
};