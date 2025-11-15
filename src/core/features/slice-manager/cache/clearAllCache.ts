import log from 'loglevel';

import { sagaCache } from './cacheStore';

export function clearAllCache(): void {
  const count = sagaCache.size;
  sagaCache.clear();
  log.debug(`🗑️ All cache cleared: ${count} entries`);
}
