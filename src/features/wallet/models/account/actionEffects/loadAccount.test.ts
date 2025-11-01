import { call } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IAccountApi } from '@/features/wallet/models/account/IAccountApi';

import { SlowDown } from '../../../utils';
import * as slicesActions from '../slice';
import { AccountLoadState } from '../types/AccountLoadState';

import { HandleStateAccountRequested, HandleStateLocked } from './loadAccount';

const mockWalletAccountApi: IAccountApi = {
  isUnlocked: vi.fn(),
  unlock: vi.fn(),
  isSigned: vi.fn(),
  prepareSignMessage: vi.fn(),
  sign: vi.fn(),
  getAccount: vi.fn(),
  listenAccountChange: vi.fn(),
  handleAccountChange: vi.fn(),
  reset: vi.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateAccountRequested is called', () => {
    it('and IWalletAccountApi.isUnlocked throws error, HandleStateLocked should be called.', () => {
      const error = new Error('mock isUnlocked error');
      return expectSaga(HandleStateAccountRequested, mockWalletAccountApi)
        .provide([
          [call(mockWalletAccountApi.isUnlocked), throwError(error)],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_REQUESTED)
        )
        .call(SlowDown)
        .call(HandleStateLocked)
        .run();
    });
    it('and IWalletAccountApi.isUnlocked returns false, HandleStateLocked should be called.', () => {
      return expectSaga(HandleStateAccountRequested, mockWalletAccountApi)
        .provide([
          [call(mockWalletAccountApi.isUnlocked), false],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_REQUESTED)
        )
        .call(SlowDown)
        .call(HandleStateLocked)
        .run();
    });
    it('and IWalletAccountApi.isUnlocked returns true, WalletAccountState should be updated as ACCOUNT_LOADED.', () => {
      return expectSaga(HandleStateAccountRequested, mockWalletAccountApi)
        .provide([
          [call(mockWalletAccountApi.isUnlocked), true],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_REQUESTED)
        )
        .call(SlowDown)
        .put(slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_LOADED))
        .run();
    });
  });
  describe('When HandleStateLocked is called', () => {
    it('WalletAccountState should be updated as LOCKED', () => {
      testSaga(HandleStateLocked)
        .next()
        .put(slicesActions.setAccountLoadState(AccountLoadState.LOCKED))
        .next()
        .isDone();
    });
  });
});
