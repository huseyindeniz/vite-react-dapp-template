import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { disconnectWallet } from '../account/actions';
import { LoadingStatusType } from '../types/LoadingStatus';

import { BlockInfo } from './types/BlockInfo';
import { Network } from './types/Network';
import { NetworkLoadState } from './types/NetworkLoadState';
import { NetworkStoreState } from './types/NetworkStoreState';

export const initialState = Object.freeze({
  networkLoadState: NetworkLoadState.IDLE,
  network: null,
  blockInfoLoading: LoadingStatusType.IDLE,
  blockInfo: null,
}) as NetworkStoreState;

const networkSlice = createSlice({
  name: 'wallet/network',
  initialState,
  reducers: {
    setNetworkLoadState: (
      state,
      { payload }: PayloadAction<NetworkLoadState>
    ) => {
      state.networkLoadState = payload;
    },
    setNetwork: (state, { payload }: PayloadAction<Network>) => {
      state.network = payload;
    },
    setBlockInfoLoading: (
      state,
      { payload }: PayloadAction<LoadingStatusType>
    ) => {
      state.blockInfoLoading = payload;
    },
    setBlockInfo: (state, { payload }: PayloadAction<BlockInfo>) => {
      state.blockInfo = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(disconnectWallet.type, state => {
      state.networkLoadState = initialState.networkLoadState;
      state.network = initialState.network;
      state.blockInfoLoading = initialState.blockInfoLoading;
      state.blockInfo = initialState.blockInfo;
    });
  },
});

export const {
  setNetworkLoadState,
  setNetwork,
  setBlockInfoLoading,
  setBlockInfo,
} = networkSlice.actions;

export const networkReducer = networkSlice.reducer;
