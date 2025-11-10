import log from 'loglevel';

import { getCacheStats } from '../lib/cache/getCacheStats';
import { CacheStats } from '../lib/cache/types/CacheStats';

export function getCacheStatsSaga(): CacheStats {
  const stats = getCacheStats();
  log.debug('Cache stats:', stats);
  return stats;
}
