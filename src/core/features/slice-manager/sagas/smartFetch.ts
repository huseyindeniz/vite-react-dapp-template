import log from 'loglevel';
import { call, select, CallEffect, SelectEffect } from 'redux-saga/effects';

import { withSliceCache } from '../hocs/withSliceCache';
import { shouldFetchData } from '../smart-fetch/shouldFetchData';
import { ApiCallGenerator } from '../types/ApiCallGenerator';
import { StateSelector } from '../types/StateSelector';
import { createCacheKey } from '../utils/createCacheKey';
import { getSliceManager } from '../SliceLifecycleManager';
import { SmartFetchOptions } from '../types/SmartFetchOptions';

export function* smartFetch<T>(
  sliceName: string,
  params: Record<string, unknown>,
  dataSelector: StateSelector<T>,
  apiCall: () => ApiCallGenerator<T>,
  options: SmartFetchOptions = {}
): Generator<CallEffect<unknown> | SelectEffect, T | null, unknown> {
  const { forceRefresh = false, languageSelector, lastFetchParamsSelector } = options;

  // Extract language from params if present
  const requestedLanguage = params.language as string | undefined;

  if (!forceRefresh) {
    const shouldFetch: unknown = yield call(
      shouldFetchData,
      sliceName,
      dataSelector,
      languageSelector || (() => null),
      requestedLanguage,
      params,
      lastFetchParamsSelector
    );
    if (!(shouldFetch as boolean)) {
      // Get strategy to provide meaningful log message
      const manager = getSliceManager();
      const config: unknown = yield call(
        [manager, 'getSliceConfig'],
        sliceName
      );
      const strategy = (config as { cleanupStrategy?: string })
        ?.cleanupStrategy;

      const reasonMap: Record<string, string> = {
        persistent: 'data is persistent',
        manual: 'data requires manual cleanup',
        component: 'component still active',
        route: 'route still active',
        cached: 'data is fresh',
      };
      const reason = reasonMap[strategy || ''] || 'data exists';

      log.debug(`⏭️ Skipping fetch for ${sliceName} - ${reason}`);
      const existingData: unknown = yield select(dataSelector);
      return existingData as T;
    }
  }

  // Auto-generate cache key from slice name + params
  const cacheKey = createCacheKey(sliceName, 'fetch', params);

  const result: unknown = yield call(
    withSliceCache,
    sliceName,
    cacheKey,
    apiCall,
    options
  );
  return result as T;
}
