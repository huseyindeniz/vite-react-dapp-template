import log from 'loglevel';

import { sagaCache } from './cacheStore';
import { CacheEntry } from './types/CacheEntry';

export function setCachedData(cacheKey: string, data: unknown, ttl = 300000): void {
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  sagaCache.set(cacheKey, entry);
  log.debug(`💾 Cache stored: ${cacheKey} (expires in ${ttl / 1000}s)`);
}
