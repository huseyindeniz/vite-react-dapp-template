import log from 'loglevel';
import { call, CallEffect } from 'redux-saga/effects';

import { getSliceManager } from '../../SliceLifecycleManager';
import { getCachedData } from '../cache/getCachedData';
import { setCachedData } from '../cache/setCachedData';
import { CacheOptions } from '../cache/types/CacheOptions';
import { updateSliceAccessTime } from '../slice-integration/updateSliceAccessTime';
import { ApiCallGenerator } from '../types/ApiCallGenerator';

export function* withSliceCache<T>(
  sliceName: string,
  cacheKey: string,
  apiCall: () => ApiCallGenerator<T>,
  options: CacheOptions = {}
): Generator<CallEffect<unknown>, T, unknown> {
  // Get slice configuration from SliceManager
  const manager = getSliceManager();
  const sliceConfig: unknown = yield call(
    [manager, 'getSliceConfig'],
    sliceName
  );
  const config = sliceConfig as {
    cleanupStrategy?: string;
    cacheTimeout?: number;
  };

  const { forceRefresh = false, updateAccessTime = true } = options;

  // Only use saga cache for 'cached' strategy
  // Other strategies rely on Redux state + smartFetch logic
  const useSagaCache = config?.cleanupStrategy === 'cached';

  // Try cache first (only for 'cached' strategy)
  if (useSagaCache && !forceRefresh) {
    const cachedData = getCachedData(`${sliceName}:${cacheKey}`);
    if (cachedData !== null) {
      if (updateAccessTime) {
        yield call(updateSliceAccessTime, sliceName);
      }
      return cachedData as T;
    }
  }

  // No cache hit, make the API call
  log.debug(`🌐 Fetching fresh data: ${sliceName}/${cacheKey}`);
  const data: unknown = yield call(apiCall);

  // Cache the result ONLY for 'cached' strategy
  if (useSagaCache) {
    const ttl = config.cacheTimeout ?? 300000; // Use configured timeout or 5 min default
    setCachedData(`${sliceName}:${cacheKey}`, data, ttl);
  }

  // Update slice access time
  if (updateAccessTime) {
    yield call(updateSliceAccessTime, sliceName);
  }

  return data as T;
}
