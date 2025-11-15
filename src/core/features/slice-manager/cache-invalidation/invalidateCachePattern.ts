import log from 'loglevel';

import { sagaCache } from '../cache/cacheStore';

export function invalidateCachePattern(pattern: RegExp): void {
  const keysToDelete: string[] = [];

  sagaCache.forEach((_, key) => {
    if (pattern.test(key)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => sagaCache.delete(key));
  log.debug(`🗑️ Cache invalidated by pattern: ${keysToDelete.length} entries`);
}
