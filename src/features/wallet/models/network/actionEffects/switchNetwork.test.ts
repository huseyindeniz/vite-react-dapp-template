import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { HardhatChain } from '../../../chains/hardhat';
import { SlowDown } from '../../../utils';
import * as walletStateSliceActions from '../../slice';
import * as actions from '../actions';
import { IWalletNetworkApi } from '../IWalletNetworkApi';
import * as slicesActions from '../slice';
import { NetworkLoadState } from '../types/NetworkLoadState';

import {
  HandleStateNetworkSwitchFailed,
  HandleStateNetworkSwitchRejected,
  HandleStateNetworkSwitchRequested,
} from './switchNetwork';

const mockWalletNetworkApi: IWalletNetworkApi = {
  loadNetwork: jest.fn(),
  getNetwork: jest.fn(),
  switchNetwork: jest.fn(),
  listenNetworkChange: jest.fn(),
  handleNetworkChange: jest.fn(),
  getLatestBlock: jest.fn(),
  getBalance: jest.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateNetworkSwitchRequested is called', () => {
    it('network switched successfully', () => {
      return expectSaga(
        HandleStateNetworkSwitchRequested,
        HardhatChain.chainId,
        mockWalletNetworkApi
      )
        .provide([
          [
            call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId),
            true,
          ],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_REQUESTED
          )
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId)
        .put({ type: actions.loadNetwork.type })
        .returns(true)
        .run();
    });
    it('network can not switched without Exception', () => {
      const error = new Error('Network switch failed');
      return expectSaga(
        HandleStateNetworkSwitchRequested,
        HardhatChain.chainId,
        mockWalletNetworkApi
      )
        .provide([
          [
            call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId),
            false,
          ],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_REQUESTED
          )
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId)
        .call(HandleStateNetworkSwitchFailed, error.message)
        .returns(false)
        .run();
    });
    it('network can not switched with Exception', () => {
      const error = new Error('mock network switch exception');
      return expectSaga(
        HandleStateNetworkSwitchRequested,
        HardhatChain.chainId,
        mockWalletNetworkApi
      )
        .provide([
          [
            call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId),
            throwError(error),
          ],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_REQUESTED
          )
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId)
        .call(HandleStateNetworkSwitchFailed, error.message)
        .returns(false)
        .run();
    });
    it('network switch rejected', () => {
      const error = new Error('switch_rejected');
      return expectSaga(
        HandleStateNetworkSwitchRequested,
        HardhatChain.chainId,
        mockWalletNetworkApi
      )
        .provide([
          [
            call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId),
            throwError(error),
          ],
          [call(SlowDown), null],
        ])
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_REQUESTED
          )
        )
        .call(SlowDown)
        .call(mockWalletNetworkApi.switchNetwork, HardhatChain.chainId)
        .call(HandleStateNetworkSwitchRejected)
        .returns(false)
        .run();
    });
  });

  describe('When HandleStateNetworkSwitchRejected is called', () => {
    it('should call setError and setWalletNetworkState actions with the correct payload', () => {
      return expectSaga(HandleStateNetworkSwitchRejected)
        .put(walletStateSliceActions.setError('Network switch rejected'))
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_REJECTED
          )
        )
        .run();
    });
  });

  describe('When HandleStateNetworkSwitchFailed is called', () => {
    it('should call setError and setWalletNetworkState actions with the correct payload', () => {
      const error = 'network switch failed';
      return expectSaga(HandleStateNetworkSwitchFailed, error)
        .put(walletStateSliceActions.setError(error))
        .put(
          slicesActions.setNetworkLoadState(
            NetworkLoadState.NETWORK_SWITCH_FAILED
          )
        )
        .run();
    });
  });
});
