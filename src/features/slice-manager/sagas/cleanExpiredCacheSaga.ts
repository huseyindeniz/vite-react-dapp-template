import log from 'loglevel';

import { cleanExpiredCache } from '../lib/cache/cleanExpiredCache';

export function cleanExpiredCacheSaga(): number {
  const cleanedCount = cleanExpiredCache();
  log.debug(`Cleaned ${cleanedCount} expired cache entries`);
  return cleanedCount;
}
