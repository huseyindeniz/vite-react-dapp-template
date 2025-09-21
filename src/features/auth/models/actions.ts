import { createAction } from '@reduxjs/toolkit';

import { AuthProviderName } from '../types/IAuthProvider';

import { AuthUser } from './types/AuthUser';

// Action Types
export const INITIALIZE_AUTH = 'auth/initialize';
export const LOGIN_WITH_PROVIDER = 'auth/loginWithProvider';
export const LOGOUT = 'auth/logout';

// Action Effects (for sagas)
export const initializeAuth = createAction(INITIALIZE_AUTH);

export const loginWithProvider = createAction<{
  provider: AuthProviderName;
}>(LOGIN_WITH_PROVIDER);

export const logout = createAction(LOGOUT);

// Internal actions (for reducers)
export const authInitialized = createAction('auth/initialized');

export const loginStarted = createAction<{
  provider: AuthProviderName;
}>('auth/loginStarted');

export const loginSucceeded = createAction<{
  user: AuthUser;
  provider: AuthProviderName;
}>('auth/loginSucceeded');

export const userUpdated = createAction<{
  user: AuthUser;
}>('auth/userUpdated');

export const loginFailed = createAction<{
  error: string;
}>('auth/loginFailed');

export const logoutStarted = createAction('auth/logoutStarted');

export const logoutSucceeded = createAction('auth/logoutSucceeded');

export const logoutFailed = createAction<{
  error: string;
}>('auth/logoutFailed');



export const authError = createAction<{
  error: string;
}>('auth/error');
