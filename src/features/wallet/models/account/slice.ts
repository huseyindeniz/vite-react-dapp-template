import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SIGN_TIMEOUT_IN_SEC } from '../../config';

import { disconnectWallet } from './actions';
import { AccountType } from './types/Account';
import { AccountLoadState } from './types/AccountLoadState';
import { AccountSignState } from './types/AccountSignState';
import { AccountStoreState } from './types/AccountStoreState';

export const initialState = Object.freeze({
  accountLoadState: AccountLoadState.IDLE,
  accountSignState: AccountSignState.IDLE,
  signCounter: SIGN_TIMEOUT_IN_SEC,
  account: null,
}) as AccountStoreState;

const accountSlice = createSlice({
  name: 'wallet/account',
  initialState: initialState,
  reducers: {
    setAccountLoadState: (
      state,
      { payload }: PayloadAction<AccountLoadState>
    ) => {
      state.accountLoadState = payload;
    },
    setAccountSignState: (
      state,
      { payload }: PayloadAction<AccountSignState>
    ) => {
      state.accountSignState = payload;
    },
    decSignCounter: state => {
      if (state.signCounter > 0) {
        --state.signCounter;
      }
    },
    resetSignCounter: state => {
      state.signCounter = initialState.signCounter;
    },
    setAccount: (state, { payload }: PayloadAction<AccountType>) => {
      state.account = payload;
    },
    setAccountDomainName: (state, { payload }: PayloadAction<string>) => {
      if (state.account) {
        state.account.domainName = payload;
      }
    },
    setAccountAvatarURL: (state, { payload }: PayloadAction<string>) => {
      if (state.account) {
        state.account.avatarURL = payload;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(disconnectWallet.type, state => {
      state.accountLoadState = initialState.accountLoadState;
      state.accountSignState = initialState.accountSignState;
      state.signCounter = initialState.signCounter;
      state.account = initialState.account;
    });
  },
});

export const {
  setAccountLoadState,
  setAccount,
  setAccountDomainName,
  setAccountAvatarURL,
  setAccountSignState,
  decSignCounter,
  resetSignCounter,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
