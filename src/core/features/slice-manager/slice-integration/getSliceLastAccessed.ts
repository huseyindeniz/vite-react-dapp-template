import log from 'loglevel';
import { call, CallEffect } from 'redux-saga/effects';

import { getSliceManager } from '../SliceLifecycleManager';

export function* getSliceLastAccessed(
  sliceName: string
): Generator<CallEffect<number>, number, number> {
  try {
    const manager = getSliceManager();
    return yield call([manager, 'getSliceLastAccessed'], sliceName);
  } catch (error) {
    log.warn(`Failed to get last accessed time for ${sliceName}:`, error);
    return 0;
  }
}
