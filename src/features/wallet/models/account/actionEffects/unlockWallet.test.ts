import { call } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IWalletAccountApi } from '@/services/interfaces/IWalletAccountApi';

import { SlowDown } from '../../../utils';
import { WalletState } from '../../types/WalletState';
import * as slicesActions from '../slice';
import { AccountLoadState } from '../types/AccountLoadState';

import {
  HandleStateLocked,
  HandleStateUnlockFailed,
  HandleStateUnlockRejected,
  HandleStateUnlockRequested,
} from './unlockWallet';

const mockWalletAccountApi: IWalletAccountApi = {
  isUnlocked: jest.fn(),
  unlock: jest.fn(),
  isSigned: jest.fn(),
  sign: jest.fn(),
  getAccount: jest.fn(),
  isDomainNameSupported: jest.fn(),
  getDomainName: jest.fn(),
  listenAccountChange: jest.fn(),
  handleAccountChange: jest.fn(),
  reset: jest.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateLocked is called', () => {
    it('WalletAccountState should be updated as LOCKED', () => {
      testSaga(HandleStateLocked)
        .next()
        .put(slicesActions.setAccountLoadState(AccountLoadState.LOCKED))
        .next()
        .isDone();
    });
  });
  describe('When HandleStateUnlockRequested is called', () => {
    it('and IWalletAccountApi.unlock throws unlock_rejected error, HandleStateUnlockRejected should be called.', () => {
      const error = new Error('unlock_rejected');
      return expectSaga(HandleStateUnlockRequested, mockWalletAccountApi)
        .provide([
          [call(mockWalletAccountApi.unlock), throwError(error)],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REQUESTED)
        )
        .call(SlowDown)
        .call(HandleStateUnlockRejected)
        .run();
    });
    it('and IWalletAccountApi.unlock throws error, HandleStateUnlockFailed should be called.', () => {
      const error = new Error('mock unlock error');
      return expectSaga(HandleStateUnlockRequested, mockWalletAccountApi)
        .provide([
          [call(mockWalletAccountApi.unlock), throwError(error)],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REQUESTED)
        )
        .call(SlowDown)
        .call(HandleStateUnlockFailed)
        .run();
    });
    it("and IWalletAccountApi.unlock doesn't throw error, WalletAccountState should be updated as ACCOUNT_LOADED.", () => {
      const mockState = {
        wallet: {
          account: {
            accountLoadState: AccountLoadState.UNLOCK_REQUESTED,
          },
          state: {
            state: WalletState.CHECKING_ACCOUNT,
          },
        },
      };
      return expectSaga(HandleStateUnlockRequested, mockWalletAccountApi)
        .withState(mockState)
        .provide([
          [call(mockWalletAccountApi.unlock), null],
          [call(mockWalletAccountApi.isUnlocked), true],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REQUESTED)
        )
        .call(SlowDown)
        .put(slicesActions.setAccountLoadState(AccountLoadState.ACCOUNT_LOADED))
        .run();
    });
  });
  describe('When HandleStateUnlockRejected is called', () => {
    it('WalletAccountState should be updated as UNLOCK_REJECTED', () => {
      testSaga(HandleStateUnlockRejected)
        .next()
        .put(
          slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_REJECTED)
        )
        .next()
        .isDone();
    });
  });
  describe('When HandleStateUnlockFailed is called', () => {
    it('WalletAccountState should be updated as UNLOCK_FAILED', () => {
      testSaga(HandleStateUnlockFailed)
        .next()
        .put(slicesActions.setAccountLoadState(AccountLoadState.UNLOCK_FAILED))
        .next()
        .isDone();
    });
  });
});
