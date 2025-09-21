import { createSlice } from '@reduxjs/toolkit';

import {
  authInitialized,
  loginStarted,
  loginSucceeded,
  loginFailed,
  logoutStarted,
  logoutSucceeded,
  logoutFailed,
  authError,
} from './actions';
import { AuthState } from './types/AuthState';
import { initialAuthState } from './types/AuthStoreState';

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(authInitialized, (state) => {
        state.state = AuthState.READY;
        state.isInitialized = true;
        state.error = null;
      })

      // Login flow
      .addCase(loginStarted, (state, action) => {
        state.state = AuthState.LOGGING_IN;
        state.currentProvider = action.payload.provider;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSucceeded, (state, action) => {
        state.state = AuthState.AUTHENTICATED;
        state.user = action.payload.user;
        state.currentProvider = action.payload.provider;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginFailed, (state, action) => {
        state.state = AuthState.ERROR;
        state.user = null;
        state.currentProvider = null;
        state.isLoading = false;
        state.error = action.payload.error;
      })

      // Logout flow
      .addCase(logoutStarted, (state) => {
        state.state = AuthState.LOGGING_OUT;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutSucceeded, (state) => {
        state.state = AuthState.READY;
        state.user = null;
        state.currentProvider = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutFailed, (state, action) => {
        state.state = AuthState.ERROR;
        state.isLoading = false;
        state.error = action.payload.error;
      })



      // Error handling
      .addCase(authError, (state, action) => {
        state.state = AuthState.ERROR;
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export default authSlice.reducer;