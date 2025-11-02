import { call } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IProviderApi } from '@/features/wallet/models/provider/IProviderApi';
import { SupportedWallets } from '@/features/wallet/models/provider/types/SupportedWallets';

import { SlowDown } from '../../../utils';
import * as walletStateSliceActions from '../../slice';
import * as slicesActions from '../slice';
import { ProviderLoadState } from '../types/ProviderLoadState';

import {
  HandleStateProviderRequested,
  HandleStateProviderFailed,
  HandleStateProviderNotSupported,
} from './loadProvider';

const mockWalletInitApi: IProviderApi = {
  detectWallets: vi.fn(),
  loadProvider: vi.fn(),
};

describe.skip('Feature: Wallet', () => {
  describe('When HandleStateWalletRequested is called', () => {
    it('and IWalletInitApi.loadProvider throws error, HandleStateWalletFailed should be called.', () => {
      const error = new Error('Wallet detection failed');
      return expectSaga(
        HandleStateProviderRequested,
        mockWalletInitApi,
        SupportedWallets.METAMASK
      )
        .provide([
          [
            call(mockWalletInitApi.loadProvider, SupportedWallets.METAMASK),
            throwError(error),
          ],
          [call(SlowDown), null],
        ])
        .put(slicesActions.setProviderLoadState(ProviderLoadState.REQUESTED))
        .call(SlowDown)
        .call(HandleStateProviderFailed, error.message)
        .run();
    });
    it('and IWalletInitApi.loadProvider returns false, HandleStateWalletNotSupported should be called.', () => {
      return expectSaga(
        HandleStateProviderRequested,
        mockWalletInitApi,
        SupportedWallets.METAMASK
      )
        .provide([
          [
            call(mockWalletInitApi.loadProvider, SupportedWallets.METAMASK),
            false,
          ],
          [call(SlowDown), null],
        ])
        .put(slicesActions.setProviderLoadState(ProviderLoadState.REQUESTED))
        .call(SlowDown)
        .call(HandleStateProviderNotSupported)
        .run();
    });
    it('and IWalletInitApi.loadProvider returns true, WalletInitState should be updated as INITIALIZED.', () => {
      return expectSaga(
        HandleStateProviderRequested,
        mockWalletInitApi,
        SupportedWallets.METAMASK
      )
        .provide([
          [
            call(mockWalletInitApi.loadProvider, SupportedWallets.METAMASK),
            true,
          ],
          [call(SlowDown), null],
        ])
        .put(slicesActions.setProviderLoadState(ProviderLoadState.REQUESTED))
        .call(SlowDown)
        .put(slicesActions.setProviderLoadState(ProviderLoadState.INITIALIZED))
        .run();
    });
  });
  describe('When HandleStateWalletFailed is called', () => {
    it('WalletInitState should be updated as INIT_FAILED', () => {
      const mockErrorMessage = 'wallet detection failed';
      testSaga(HandleStateProviderFailed, mockErrorMessage)
        .next()
        .put(walletStateSliceActions.setError(mockErrorMessage))
        .next()
        .put(slicesActions.setProviderLoadState(ProviderLoadState.FAILED))
        .next()
        .isDone();
    });
  });
  describe('When HandleStateWalletNotSupported is called', () => {
    it('WalletInitState should be updated as NOT_SUPPORTED', () => {
      testSaga(HandleStateProviderNotSupported)
        .next()
        .put(
          slicesActions.setProviderLoadState(ProviderLoadState.NOT_SUPPORTED)
        )
        .next()
        .isDone();
    });
  });
});
