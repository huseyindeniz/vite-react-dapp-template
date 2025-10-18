import { call, spawn, put, delay, select } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IWalletAccountApi } from '@/features/wallet/interfaces/IWalletAccountApi';

import { SIGN_TIMEOUT_IN_SEC } from '../../../config';
import { SlowDown } from '../../../utils';
import * as walletStateSliceActions from '../../slice';
import { WalletState } from '../../types/WalletState';
import * as slicesActions from '../slice';
import { AccountSignState } from '../types/AccountSignState';

import {
  CheckSignTimeout,
  HandleStateSignFailed,
  HandleStateSignRejected,
  HandleStateSignRequested,
  HandleStateSignTimedout,
} from './signIn';

const mockWalletSignApi: IWalletAccountApi = {
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

const message = 'test message';

describe('Feature: Wallet', () => {
  describe('When HandleStateSignRequested is called', () => {
    it.skip('and IWalletSignApi.sign throws error, HandleStateSignFailed should be called with error message.', () => {
      const error = new Error('SIGN_FAILED');
      return expectSaga(HandleStateSignRequested, mockWalletSignApi, message)
        .provide([
          [spawn(CheckSignTimeout), null],
          [call(SlowDown), null],
          [call(mockWalletSignApi.sign, message), throwError(error)],
        ])
        .put(slicesActions.setAccountSignState(AccountSignState.SIGN_REQUESTED))
        .call(SlowDown)
        .call(HandleStateSignFailed, error.message)
        .run();
    });

    it.skip('and IWalletSignApi.sign throws error with "sign_rejected" message, HandleStateSignRejected should be called.', () => {
      const error = new Error('sign_rejected');
      return expectSaga(HandleStateSignRequested, mockWalletSignApi, message)
        .provide([
          [spawn(CheckSignTimeout), null],
          [call(SlowDown), null],
          [call(mockWalletSignApi.sign, message), throwError(error)],
        ])
        .put(slicesActions.setAccountSignState(AccountSignState.SIGN_REQUESTED))
        .call(SlowDown)
        .call(HandleStateSignRejected)
        .run();
    });
  });

  describe('When CheckSignTimeout is called', () => {
    it('should handle the sign timeout correctly', () => {
      const getState = () => ({
        wallet: {
          state: {
            state: WalletState.CHECKING_SIGN,
          },
          account: {
            accountSignState: AccountSignState.SIGN_REQUESTED,
          },
        },
      });

      return expectSaga(CheckSignTimeout)
        .provide([
          [select(getState), getState()],
          [call(HandleStateSignTimedout), null],
          [put(slicesActions.decSignCounter()), null],
          [put(slicesActions.resetSignCounter()), null],
          [delay(1000), null],
        ])
        .withState(getState())
        .call(HandleStateSignTimedout)
        .put(slicesActions.decSignCounter())
        .put(slicesActions.resetSignCounter())
        .run(SIGN_TIMEOUT_IN_SEC * 1000);
    });
  });

  describe('When HandleStateSignRejected is called', () => {
    it.skip('should set state as SIGN_REJECTED', () => {
      testSaga(HandleStateSignRejected)
        .next()
        .put(slicesActions.setAccountSignState(AccountSignState.SIGN_REJECTED))
        .next()
        .isDone();
    });
  });

  describe('When HandleStateSignTimedout is called', () => {
    it('should set state as SIGN_TIMED_OUT', () => {
      testSaga(HandleStateSignTimedout)
        .next()
        .put(slicesActions.setAccountSignState(AccountSignState.SIGN_TIMED_OUT))
        .next()
        .isDone();
    });
  });

  describe('When HandleStateSignFailed is called', () => {
    it.skip('should call setError and setWalletSignState actions with the correct payload', () => {
      const error = 'mock sign error';
      testSaga(HandleStateSignFailed, error)
        .next()
        .put(walletStateSliceActions.setError(error))
        .next()
        .put(slicesActions.setAccountSignState(AccountSignState.SIGN_FAILED))
        .next()
        .isDone();
    });
  });
});
