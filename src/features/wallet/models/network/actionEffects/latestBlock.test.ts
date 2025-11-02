import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { INetworkApi } from '@/features/wallet/models/network/interfaces/INetworkApi';

import * as slicesActions from '../slice';
import { BlockInfo } from '../types/BlockInfo';

import { HandleStateBlockRequested } from './latestBlock';

const mockWalletNetworkApi: INetworkApi = {
  loadNetwork: vi.fn(),
  getNetwork: vi.fn(),
  switchNetwork: vi.fn(),
  listenNetworkChange: vi.fn(),
  handleNetworkChange: vi.fn(),
  getLatestBlock: vi.fn(),
  getBalance: vi.fn(),
};

describe('Feature: Wallet', () => {
  describe('When HandleStateBlockRequested is called', () => {
    it('it should set the block info in the state', () => {
      const latestBlockNumber = 2;
      const signerAccountBalance = '1000';
      const payload: BlockInfo = {
        blockNumber: latestBlockNumber.toString(),
        signerAccountBalance,
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
        signerAccountBalance,
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
