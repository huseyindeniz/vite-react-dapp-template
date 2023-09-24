import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { IWalletNetworkApi } from '@/services/interfaces/IWalletNetworkApi';

import * as slicesActions from '../slice';
import { BlockInfo } from '../types/BlockInfo';

import { HandleStateBlockRequested } from './latestBlock';

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
  describe('When HandleStateBlockRequested is called', () => {
    it('it should set the block info in the state', () => {
      const latestBlockNumber = 2;
      const signerAccountBalance = '1000';
      const payload: BlockInfo = {
        blockNumber: latestBlockNumber.toString(),
        signerAccountBalance: signerAccountBalance,
      };
      return expectSaga(HandleStateBlockRequested, mockWalletNetworkApi)
        .provide([
          [call(mockWalletNetworkApi.getLatestBlock), latestBlockNumber],
          [call(mockWalletNetworkApi.getBalance), signerAccountBalance],
        ])
        .put(slicesActions.setBlockInfo(payload))
        .run();
    });
    it('it should set the block number as an empty string if getLatestBlock returns undefined', () => {
      const signerAccountBalance = '1000';
      const payload: BlockInfo = {
        blockNumber: '',
        signerAccountBalance: signerAccountBalance,
      };
      return expectSaga(HandleStateBlockRequested, mockWalletNetworkApi)
        .provide([
          [call(mockWalletNetworkApi.getLatestBlock), undefined],
          [call(mockWalletNetworkApi.getBalance), signerAccountBalance],
        ])
        .put(slicesActions.setBlockInfo(payload))
        .run();
    });
  });
});
