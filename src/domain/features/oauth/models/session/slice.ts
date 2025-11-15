import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OAuthProviderName } from '../provider/types/OAuthProviderName';

import { OAuthState } from './types/OAuthState';
import { initialOAuthState } from './types/OAuthStoreState';
import { OAuthUser } from './types/OAuthUser';

export const sessionSlice = createSlice({
  name: 'oauth/session',
  initialState: initialOAuthState,
  reducers: {
    setState: (state, action: PayloadAction<OAuthState>) => {
      state.state = action.payload;
    },
    setUser: (state, action: PayloadAction<OAuthUser | null>) => {
      state.user = action.payload;
    },
    setCurrentProvider: (
      state,
      action: PayloadAction<OAuthProviderName | null>
    ) => {
      state.currentProvider = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setState, setUser, setCurrentProvider, setError } =
  sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
