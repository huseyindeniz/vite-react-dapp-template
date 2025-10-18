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
  languageSelector?: StateSelector<string | null>;
}

// Saga generator type for API calls
type ApiCallGenerator<T> = Generator<CallEffect<T>, T, unknown>;

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

// ============================================================================
// SMART FETCH - ONLY FETCH IF DATA IS STALE
// ============================================================================

function* shouldFetchData<T>(
  sliceName: string,
  dataSelector: StateSelector<T>,
  languageSelector: StateSelector<string | null>,
  requestedLanguage?: string
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

  // Check if language changed (if language is being used)
  if (requestedLanguage !== undefined) {
    const storedLanguageRaw: unknown = yield select(languageSelector);
    const storedLanguage = storedLanguageRaw as string | null;
    if (storedLanguage !== requestedLanguage) {
      log.debug(
        `🌐 Language changed: ${storedLanguage} -> ${requestedLanguage}`
      );
      return true; // Language changed, fetch fresh data
    }
  }

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

  // If data exists, check cleanupStrategy
  if (!config?.cleanupStrategy) {
    return false; // No config, use existing data
  }

  // Only 'cached' strategy should re-fetch based on timeout
  if (config.cleanupStrategy === 'cached') {
    const cacheTimeout = config.cacheTimeout ?? 300000; // 5 minutes default
    const lastAccessed: unknown = yield call(getSliceLastAccessed, sliceName);
    const age = Date.now() - (lastAccessed as number);
    return age > cacheTimeout;
  }

  // All other strategies (persistent, manual, component, route): use existing data
  return false;
}

function* smartFetch<T>(
  sliceName: string,
  params: Record<string, unknown>,
  dataSelector: StateSelector<T>,
  apiCall: () => ApiCallGenerator<T>,
  options: SmartFetchOptions = {}
): Generator<CallEffect<unknown> | SelectEffect, T | null, unknown> {
  const { forceRefresh = false, languageSelector } = options;

  // Extract language from params if present
  const requestedLanguage = params.language as string | undefined;

  if (!forceRefresh) {
    const shouldFetch: unknown = yield call(
      shouldFetchData,
      sliceName,
      dataSelector,
      languageSelector || (() => null),
      requestedLanguage
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
