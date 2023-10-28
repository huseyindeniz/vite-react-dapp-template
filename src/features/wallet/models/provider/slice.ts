import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { disconnectWallet } from '../account/actions';

import { ProviderLoadState } from './types/ProviderLoadState';
import { ProviderStoreState } from './types/ProviderStoreState';
import { Web3Wallet } from './types/Web3Wallet';

export const initialState = Object.freeze({
  providerLoadState: ProviderLoadState.IDLE,
  installedWallets: [],
  connectedWallet: null,
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
    setInstalledWallets: (state, { payload }: PayloadAction<Web3Wallet[]>) => {
      state.installedWallets = payload;
    },
    setConnectedWallet: (state, { payload }: PayloadAction<Web3Wallet>) => {
      state.connectedWallet = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(disconnectWallet.type, state => {
      state.providerLoadState = initialState.providerLoadState;
      state.installedWallets = initialState.installedWallets;
    });
  },
});

export const { setProviderLoadState, setInstalledWallets, setConnectedWallet } =
  providerSlice.actions;

export const providerReducer = providerSlice.reducer;
