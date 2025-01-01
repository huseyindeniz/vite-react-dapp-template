import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { disconnectWallet } from './account/actions';
import { LoadingStatusType } from './types/LoadingStatus';
import { WalletState } from './types/WalletState';
import { WalletStoreState } from './types/WalletStoreState';

export const initialState = Object.freeze({
  loading: LoadingStatusType.IDLE,
  error: null,
  state: WalletState.NOT_INITIALIZED,
}) as WalletStoreState;

const walletStateSlice = createSlice({
  name: 'wallet/walletState',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<LoadingStatusType>) => {
      state.loading = payload;
    },
    setError: (state, { payload }: PayloadAction<string | null>) => {
      state.error = payload;
    },
    setState: (state, { payload }: PayloadAction<WalletState>) => {
      state.state = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(disconnectWallet.type, state => {
      state.loading = initialState.loading;
      state.error = initialState.error;
      state.state = initialState.state;
    });
  },
});

export const { setLoading, setError, setState } = walletStateSlice.actions;

export const walletStateReducer = walletStateSlice.reducer;
