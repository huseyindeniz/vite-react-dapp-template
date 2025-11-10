import log from 'loglevel';
import { call, CallEffect } from 'redux-saga/effects';

import { getSliceManager } from '../SliceLifecycleManager';

export function* shouldUseSliceCache(
  sliceName: string
): Generator<CallEffect<boolean>, boolean, boolean> {
  try {
    const manager = getSliceManager();
    return yield call([manager, 'isSliceCachingEnabled'], sliceName);
  } catch (error) {
    log.warn(`Failed to check cache strategy for ${sliceName}:`, error);
    return false;
  }
}
