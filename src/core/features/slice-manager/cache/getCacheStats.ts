import { sagaCache } from './cacheStore';
import { CacheStats } from './types/CacheStats';

export function getCacheStats(): CacheStats {
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
