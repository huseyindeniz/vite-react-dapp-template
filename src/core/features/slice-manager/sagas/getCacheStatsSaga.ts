import log from 'loglevel';

import { getCacheStats } from '../cache/getCacheStats';
import { CacheStats } from '../cache/types/CacheStats';

export function getCacheStatsSaga(): CacheStats {
  const stats = getCacheStats();
  log.debug('Cache stats:', stats);
  return stats;
}
