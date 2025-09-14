import { createAction } from '@reduxjs/toolkit';

import {
  AuthProviderName,
  AuthProviderCredentials,
} from '../providers/types/AuthProvider';

import { AuthSession } from './types/AuthSession';

// Action Types
export const INITIALIZE_AUTH = 'auth/initialize';
export const LOGIN_WITH_PROVIDER = 'auth/loginWithProvider';
export const LOGOUT = 'auth/logout';
export const REFRESH_TOKEN = 'auth/refreshToken';
export const RESTORE_SESSION = 'auth/restoreSession';

// Action Effects (for sagas)
export const initializeAuth = createAction(INITIALIZE_AUTH);

export const loginWithProvider = createAction<{
  provider: AuthProviderName;
}>(LOGIN_WITH_PROVIDER);

export const loginWithCredentials = createAction<{
  provider: AuthProviderName;
  credentials: AuthProviderCredentials;
}>('auth/loginWithCredentials');

export const logout = createAction(LOGOUT);

export const refreshToken = createAction(REFRESH_TOKEN);

export const restoreSession = createAction(RESTORE_SESSION);

// Internal actions (for reducers)
export const authInitialized = createAction('auth/initialized');

export const loginStarted = createAction<{
  provider: AuthProviderName;
}>('auth/loginStarted');

export const loginSucceeded = createAction<{
  session: AuthSession;
  provider: AuthProviderName;
}>('auth/loginSucceeded');

export const loginFailed = createAction<{
  error: string;
}>('auth/loginFailed');

export const logoutStarted = createAction('auth/logoutStarted');

export const logoutSucceeded = createAction('auth/logoutSucceeded');

export const logoutFailed = createAction<{
  error: string;
}>('auth/logoutFailed');

export const tokenRefreshStarted = createAction('auth/tokenRefreshStarted');

export const tokenRefreshSucceeded = createAction<{
  session: AuthSession;
}>('auth/tokenRefreshSucceeded');

export const tokenRefreshFailed = createAction<{
  error: string;
}>('auth/tokenRefreshFailed');

export const sessionRestored = createAction<{
  session: AuthSession;
  provider: AuthProviderName;
}>('auth/sessionRestored');

export const sessionExpired = createAction('auth/sessionExpired');

export const authError = createAction<{
  error: string;
}>('auth/error');
