import log from 'loglevel';
import {
  call,
  select,
  all,
  CallEffect,
  SelectEffect,
  AllEffect,
} from 'redux-saga/effects';

import { getSliceManager } from '../SliceLifecycleManager';

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
  updateAccessTime?: boolean;
}

interface SmartFetchOptions {
  maxAge?: number;
  forceRefresh?: boolean;
  ttl?: number;
}

// Saga generator type for API calls
type ApiCallGenerator<T> = Generator<unknown, T, unknown>;

// Selector type
type StateSelector<T> = (state: unknown) => T;

// ============================================================================
// CACHE STORE
// ============================================================================

const sagaCache = new Map<string, CacheEntry>();

// ============================================================================
// CACHE UTILITIES
// ============================================================================

function getCachedData(cacheKey: string): unknown | null {
  const entry = sagaCache.get(cacheKey);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now > entry.timestamp + entry.ttl) {
    sagaCache.delete(cacheKey);
    log.debug(`⏰ Cache expired: ${cacheKey}`);
    return null;
  }

  log.debug(`✅ Cache hit: ${cacheKey}`);
  return entry.data;
}

function setCachedData(cacheKey: string, data: unknown, ttl = 300000): void {
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  sagaCache.set(cacheKey, entry);
  log.debug(`💾 Cache stored: ${cacheKey} (expires in ${ttl / 1000}s)`);
}

function clearSliceCache(sliceName: string): void {
  const keysToDelete: string[] = [];

  sagaCache.forEach((_, key) => {
    if (key.startsWith(`${sliceName}:`)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => sagaCache.delete(key));
  log.debug(
    `🗑️ Cache cleared for ${sliceName} (${keysToDelete.length} entries)`
  );
}

function clearAllCache(): void {
  const count = sagaCache.size;
  sagaCache.clear();
  log.debug(`🗑️ All cache cleared: ${count} entries`);
}

// ============================================================================
// SLICE MANAGER INTEGRATION
// ============================================================================

function* shouldUseSliceCache(
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

function* updateSliceAccessTime(
  sliceName: string
): Generator<CallEffect<void>, void, void> {
  try {
    const manager = getSliceManager();
    yield call([manager, 'updateSliceAccess'], sliceName);
  } catch (error) {
    log.warn(`Failed to update access time for ${sliceName}:`, error);
  }
}

function* getSliceLastAccessed(
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

// ============================================================================
// MAIN CACHE WRAPPER
// ============================================================================

function* withSliceCache<T>(
  sliceName: string,
  cacheKey: string,
  apiCall: () => ApiCallGenerator<T>,
  options: CacheOptions = {}
): Generator<CallEffect<unknown>, T, unknown> {
  const {
    ttl = 300000, // 5 minutes default
    forceRefresh = false,
    updateAccessTime = true,
  } = options;

  // Check if this slice should use caching
  const useCacheResult: unknown = yield call(shouldUseSliceCache, sliceName);
  const useCache: boolean =
    typeof useCacheResult === 'boolean' ? useCacheResult : false;

  // Try cache first (if enabled and not force refresh)
  if (useCache && !forceRefresh) {
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

  // Cache the result if caching is enabled
  if (useCache) {
    setCachedData(`${sliceName}:${cacheKey}`, data, ttl);
  }

  // Update slice access time
  if (updateAccessTime) {
    yield call(updateSliceAccessTime, sliceName);
  }

  return data as T;
}

// ============================================================================
// SMART FETCH - ONLY FETCH IF DATA IS STALE
// ============================================================================

function* shouldFetchData<T>(
  sliceName: string,
  dataSelector: StateSelector<T>,
  maxAge = 300000 // 5 minutes
): Generator<SelectEffect | CallEffect<unknown>, boolean, unknown> {
  // Check if we have current data
  const currentDataRaw: unknown = yield select(dataSelector);
  const currentData = currentDataRaw as T;
  // If no data or empty array, should fetch
  if (
    !currentData ||
    (Array.isArray(currentData) && (currentData as unknown[]).length === 0)
  ) {
    return true;
  }

  // Check if data is stale based on slice access time
  const lastAccessed: unknown = yield call(getSliceLastAccessed, sliceName);
  const age = Date.now() - (lastAccessed as number);

  return age > maxAge;
}

function* smartFetch<T>(
  sliceName: string,
  cacheKey: string,
  dataSelector: StateSelector<T>,
  apiCall: () => ApiCallGenerator<T>,
  options: SmartFetchOptions = {}
): Generator<CallEffect<unknown> | SelectEffect, T | null, unknown> {
  const { maxAge = 300000, forceRefresh = false, ttl = 300000 } = options;

  if (!forceRefresh) {
    const shouldFetch: unknown = yield call(
      shouldFetchData,
      sliceName,
      dataSelector,
      maxAge
    );
    if (!(shouldFetch as boolean)) {
      log.debug(`⏭️ Skipping fetch for ${sliceName} - data is fresh`);
      const existingData: unknown = yield select(dataSelector);
      return existingData as T;
    }
  }

  const result: unknown = yield call(
    withSliceCache,
    sliceName,
    cacheKey,
    apiCall,
    {
      ttl,
      forceRefresh,
    }
  );
  return result as T;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

interface BatchCacheOperation<T> {
  sliceName: string;
  cacheKey: string;
  apiCall: () => ApiCallGenerator<T>;
  options?: CacheOptions;
}

function* batchCacheOperations<T>(
  operations: BatchCacheOperation<T>[]
): Generator<AllEffect<CallEffect<unknown>>, T[], unknown> {
  // Execute all operations in parallel
  const calls = operations.map(op =>
    call(withSliceCache, op.sliceName, op.cacheKey, op.apiCall, op.options)
  );

  const results: unknown = yield all(calls);
  return results as T[];
}

// ============================================================================
// CACHE INVALIDATION PATTERNS
// ============================================================================

function invalidateCachePattern(pattern: RegExp): void {
  const keysToDelete: string[] = [];

  sagaCache.forEach((_, key) => {
    if (pattern.test(key)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => sagaCache.delete(key));
  log.debug(`🗑️ Cache invalidated by pattern: ${keysToDelete.length} entries`);
}

function invalidateCacheBySliceAndPattern(
  sliceName: string,
  keyPattern: string
): void {
  const pattern = new RegExp(`^${sliceName}:.*${keyPattern}.*`);
  invalidateCachePattern(pattern);
}

// ============================================================================
// CACHE MONITORING & DEBUGGING
// ============================================================================

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  expiredEntries: number;
  sliceBreakdown: Record<string, number>;
}

function getCacheStats(): CacheStats {
  const now = Date.now();
  let totalSize = 0;
  let expiredEntries = 0;
  const sliceBreakdown: Record<string, number> = {};

  sagaCache.forEach((entry, key) => {
    // Calculate approximate size (rough estimate)
    totalSize += JSON.stringify(entry.data).length;

    // Count expired entries
    if (now > entry.timestamp + entry.ttl) {
      expiredEntries++;
    }

    // Count by slice
    const sliceName = key.split(':')[0];
    if (sliceName) {
      sliceBreakdown[sliceName] = (sliceBreakdown[sliceName] || 0) + 1;
    }
  });

  return {
    totalEntries: sagaCache.size,
    totalSize,
    expiredEntries,
    sliceBreakdown,
  };
}

function cleanExpiredCache(): number {
  const now = Date.now();
  const expiredKeys: string[] = [];

  sagaCache.forEach((entry, key) => {
    if (now > entry.timestamp + entry.ttl) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach(key => sagaCache.delete(key));

  if (expiredKeys.length > 0) {
    log.debug(`🧹 Cleaned ${expiredKeys.length} expired cache entries`);
  }

  return expiredKeys.length;
}

// ============================================================================
// SAGA HELPER FUNCTIONS
// ============================================================================

function clearSliceCacheSaga(action: { payload: { sliceName: string } }): void {
  clearSliceCache(action.payload.sliceName);
  log.debug(`Cache cleared for slice: ${action.payload.sliceName}`);
}

function getCacheStatsSaga(): CacheStats {
  const stats = getCacheStats();
  log.debug('Cache stats:', stats);
  return stats;
}

function cleanExpiredCacheSaga(): number {
  const cleanedCount = cleanExpiredCache();
  log.debug(`Cleaned ${cleanedCount} expired cache entries`);
  return cleanedCount;
}

// ============================================================================
// UTILITY TYPES FOR BETTER TYPE SAFETY
// ============================================================================

export type CachedSagaCall<T> = Generator<
  CallEffect<boolean> | CallEffect<void> | CallEffect<ApiCallGenerator<T>>,
  T,
  unknown
>;

export type SmartFetchSaga<T> = Generator<
  CallEffect<boolean> | SelectEffect | CallEffect<T>,
  T | null,
  unknown
>;

// Helper function to create typed cache keys
function createCacheKey(
  sliceName: string,
  operation: string,
  params?: Record<string, unknown>
): string {
  if (params && Object.keys(params).length > 0) {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort for consistent keys
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&');
    return `${sliceName}:${operation}:${paramString}`;
  }
  return `${sliceName}:${operation}`;
}

// ============================================================================
// EXPORT ALL FOR EASY IMPORTING
// ============================================================================

export {
  // Main functions
  withSliceCache,
  smartFetch,
  shouldFetchData,
  shouldUseSliceCache,

  // Cache management
  getCachedData,
  setCachedData,
  clearSliceCache,
  clearAllCache,
  invalidateCachePattern,
  invalidateCacheBySliceAndPattern,

  // Monitoring
  getCacheStats,
  cleanExpiredCache,

  // Saga helpers
  clearSliceCacheSaga,
  getCacheStatsSaga,
  cleanExpiredCacheSaga,

  // Utilities
  createCacheKey,
  updateSliceAccessTime,
  getSliceLastAccessed,
  batchCacheOperations,
};

// ============================================================================
// USAGE EXAMPLES IN COMMENTS
// ============================================================================

/*
// Basic usage in saga:
export function* fetchPostsSaga(action: FetchPostsAction) {
  try {
    const cacheKey = createCacheKey('blogPosts', 'fetchPosts', action.payload);
    
    const posts = yield call(withSliceCache,
      'blogPosts',
      cacheKey,
      function* () {
        return yield call(api.getPosts, action.payload);
      },
      { ttl: 600000 } // 10 minutes
    );
    
    yield put(setPostsAction(posts));
  } catch (error) {
    yield put(setErrorAction(error.message));
  }
}

// Smart fetch usage:
export function* smartFetchPostsSaga(action: FetchPostsAction) {
  const posts = yield call(smartFetch,
    'blogPosts',
    createCacheKey('blogPosts', 'fetchPosts', action.payload),
    (state: RootState) => state.blog.posts,
    function* () {
      return yield call(api.getPosts, action.payload);
    },
    { maxAge: 300000, ttl: 600000 }
  );
  
  if (posts) {
    yield put(setPostsAction(posts));
  }
}

// Cache invalidation after mutations:
export function* createPostSaga(action: CreatePostAction) {
  try {
    const newPost = yield call(api.createPost, action.payload);
    yield put(addPostAction(newPost));
    
    // Invalidate related caches
    clearSliceCache('blogPosts');
    // or more specific:
    invalidateCacheBySliceAndPattern('blogPosts', 'fetchPosts');
    
  } catch (error) {
    yield put(setErrorAction(error.message));
  }
}
*/
