import log from 'loglevel';
import { call, CallEffect } from 'redux-saga/effects';

import { getSliceManager } from '../SliceLifecycleManager';

export function* updateSliceAccessTime(
  sliceName: string
): Generator<CallEffect<void>, void, void> {
  try {
    const manager = getSliceManager();
    yield call([manager, 'updateSliceAccess'], sliceName);
  } catch (error) {
    log.warn(`Failed to update access time for ${sliceName}:`, error);
  }
}
