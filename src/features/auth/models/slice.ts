import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthProviderName } from '../types/IAuthProvider';

import { AuthState } from './types/AuthState';
import { initialAuthState } from './types/AuthStoreState';
import { AuthUser } from './types/AuthUser';

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setState: (state, action: PayloadAction<AuthState>) => {
      state.state = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    setCurrentProvider: (
      state,
      action: PayloadAction<AuthProviderName | null>
    ) => {
      state.currentProvider = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setState, setUser, setCurrentProvider, setError } =
  authSlice.actions;

export default authSlice.reducer;
