import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IWalletAccountApi } from '@/features/wallet/interfaces/IWalletAccountApi';

import * as walletStateSliceActions from '../../slice';

import { HandleStateDisconnectRequested } from './disconnectWallet';

const mockWalletResetApi: IWalletAccountApi = {
  isUnlocked: vi.fn(),
  unlock: vi.fn(),
  isSigned: vi.fn(),
  prepareSignMessage: vi.fn(),
  sign: vi.fn(),
  getAccount: vi.fn(),
  isDomainNameSupported: vi.fn(),
  getDomainName: vi.fn(),
  getAvatarURL: vi.fn(),
  listenAccountChange: vi.fn(),
  handleAccountChange: vi.fn(),
  reset: vi.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateDisconnectRequested is called', () => {
    it('and IWalletResetApi.reset throws error, error should be set in the store.', () => {
      const error = new Error('Error resetting wallet');
      return expectSaga(HandleStateDisconnectRequested, mockWalletResetApi)
        .provide([[call(mockWalletResetApi.reset), throwError(error)]])
        .put(walletStateSliceActions.setError(error.message))
        .run();
    });
    it('and IWalletResetApi.reset does not throw error, no error should be set in the store.', () => {
      return expectSaga(HandleStateDisconnectRequested, mockWalletResetApi)
        .provide([[call(mockWalletResetApi.reset), null]])
        .not.put(walletStateSliceActions.setError(null))
        .run();
    });
  });
});
