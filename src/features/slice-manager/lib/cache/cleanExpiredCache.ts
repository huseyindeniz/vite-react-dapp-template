import log from 'loglevel';

import { sagaCache } from './cacheStore';

export function cleanExpiredCache(): number {
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
