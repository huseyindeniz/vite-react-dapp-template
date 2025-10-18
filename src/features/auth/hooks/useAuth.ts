import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';

import { AuthState } from '../models/types/AuthState';

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);

  return {
    // State
    state: authState.state,
    user: authState.user,
    currentProvider: authState.currentProvider,
    error: authState.error,

    // Computed states
    isLoading:
      authState.state === AuthState.LOGGING_IN ||
      authState.state === AuthState.LOGGING_OUT ||
      authState.state === AuthState.INITIALIZING,
    isInitialized: authState.state !== AuthState.NOT_INITIALIZED,
    isAuthenticated: authState.state === AuthState.AUTHENTICATED,
    isLoggingIn: authState.state === AuthState.LOGGING_IN,
    isLoggingOut: authState.state === AuthState.LOGGING_OUT,
    isReady: authState.state === AuthState.READY,
    hasError: authState.state === AuthState.ERROR,
    isInitializing: authState.state === AuthState.INITIALIZING,
  };
};
