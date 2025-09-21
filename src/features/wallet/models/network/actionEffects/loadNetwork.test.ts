import { call, spawn } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { IWalletNetworkApi } from '@/features/wallet/interfaces/IWalletNetworkApi';

import { HardhatChain } from '../../../chains/hardhat';
import { SlowDown } from '../../../utils';
import * as walletStateSliceActions from '../../slice';
import * as slicesActions from '../slice';
import { NetworkLoadState } from '../types/NetworkLoadState';

import {
  handleEventNetworkChanged,
  HandleStateNetworkDetectionFailed,
  HandleStateNetworkRequested,
  HandleStateWrongNetwork,
} from './loadNetwork';

const mockWalletNetworkApi: IWalletNetworkApi = {
  loadNetwork: vi.fn(),
  getNetwork: vi.fn(),
  switchNetwork: vi.fn(),
  listenNetworkChange: vi.fn(),
  handleNetworkChange: vi.fn(),
  getLatestBlock: vi.fn(),
  getBalance: vi.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateNetworkRequested is called', () => {
    it('network is loaded successfully', () => {
      return expectSaga(HandleStateNetworkRequested, mockWalletNetworkApi)
        .provide([
          [call(mockWalletNetworkApi.loadNetwork), HardhatChain],
          [call(SlowDown), null],
          [spawn(handleEventNetworkChanged, mockWalletNetworkApi), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(NetworkLoadState.NETWORK_REQUESTED)
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.loadNetwork)
        .put(slicesActions.setNetwork(HardhatChain))
        .put(slicesActions.setNetworkLoadState(NetworkLoadState.NETWORK_LOADED))
        .spawn(handleEventNetworkChanged, mockWalletNetworkApi)
        .returns(true)
        .run();
    });
    it('network is not loaded with Exception', () => {
      const error = new Error('mock network fail code');
      return expectSaga(HandleStateNetworkRequested, mockWalletNetworkApi)
        .provide([
          [call(mockWalletNetworkApi.loadNetwork), throwError(error)],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(NetworkLoadState.NETWORK_REQUESTED)
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.loadNetwork)
        .call(HandleStateNetworkDetectionFailed, error.message)

        .not.put.like({
          action: slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_LOADED
          ),
        })
        .returns(false)
        .run();
    });
  });

  describe('When HandleStateNetworkDetectionFailed is called', () => {
    it('should call setError and setWalletNetworkState actions with the correct payload', () => {
      const error = 'network error';
      return expectSaga(HandleStateNetworkDetectionFailed, error)
        .put(walletStateSliceActions.setError(error))
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_DETECTION_FAILED
          )
        )
        .run();
    });
  });

  describe('When HandleStateWrongNetwork is called', () => {
    it('should call setWalletNetworkState action with the correct payload', () => {
      return expectSaga(HandleStateWrongNetwork)
        .put(slicesActions.setNetworkLoadState(NetworkLoadState.WRONG_NETWORK))
        .run();
    });
  });
});
