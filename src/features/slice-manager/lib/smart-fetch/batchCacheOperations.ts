import { all, call, AllEffect, CallEffect } from 'redux-saga/effects';

import { CacheOptions } from '../cache/types/CacheOptions';
import { withSliceCache } from '../hocs/withSliceCache';
import { ApiCallGenerator } from '../types/ApiCallGenerator';

interface BatchCacheOperation<T> {
  sliceName: string;
  cacheKey: string;
  apiCall: () => ApiCallGenerator<T>;
  options?: CacheOptions;
}

export function* batchCacheOperations<T>(
  operations: BatchCacheOperation<T>[]
): Generator<AllEffect<CallEffect<unknown>>, T[], unknown> {
  // Execute all operations in parallel
  const calls = operations.map(op =>
    call(withSliceCache, op.sliceName, op.cacheKey, op.apiCall, op.options)
  );

  const results: unknown = yield all(calls);
  return results as T[];
}
