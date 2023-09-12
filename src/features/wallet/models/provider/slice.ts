import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { disconnectWallet } from '../account/actions';

import { ProviderLoadState } from './types/ProviderLoadState';
import { ProviderStoreState } from './types/ProviderStoreState';

export const initialState = Object.freeze({
  providerLoadState: ProviderLoadState.IDLE,
}) as ProviderStoreState;

const providerSlice = createSlice({
  name: 'wallet/provider',
  initialState: initialState,
  reducers: {
    setProviderLoadState: (
      state,
      { payload }: PayloadAction<ProviderLoadState>
    ) => {
      state.providerLoadState = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(disconnectWallet.type, state => {
      state.providerLoadState = initialState.providerLoadState;
    });
  },
});

export const { setProviderLoadState } = providerSlice.actions;

export const providerReducer = providerSlice.reducer;
