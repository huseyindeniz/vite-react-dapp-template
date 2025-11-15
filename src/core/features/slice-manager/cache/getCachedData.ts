import log from 'loglevel';

import { sagaCache } from './cacheStore';

export function getCachedData(cacheKey: string): unknown | null {
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
