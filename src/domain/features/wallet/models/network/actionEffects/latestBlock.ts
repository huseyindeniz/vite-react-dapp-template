import { put, call } from 'redux-saga/effects';

import { INetworkApi } from '@/domain/features/wallet/models/network/interfaces/INetworkApi';

import { LoadingStatusType } from '../../types/LoadingStatus';
import * as slicesActions from '../slice';
import { BlockInfo } from '../types/BlockInfo';

export function* ActionEffectLatestBlock(walletApi: INetworkApi) {
  yield put(slicesActions.setBlockInfoLoading(LoadingStatusType.PENDING));
  yield call(HandleStateBlockRequested, walletApi);
  yield put(slicesActions.setBlockInfoLoading(LoadingStatusType.IDLE));
}

export function* HandleStateBlockRequested(
  walletNetworkApi: INetworkApi
) {
  const latestBlockNumber: number | undefined = yield call(
    walletNetworkApi.getLatestBlock
  );
  const signerAccountBalance: string = yield call(walletNetworkApi.getBalance);
  const payload: BlockInfo = {
    blockNumber: latestBlockNumber ? latestBlockNumber.toString() : '',
    signerAccountBalance,
  };
  yield put(slicesActions.setBlockInfo(payload));
}
