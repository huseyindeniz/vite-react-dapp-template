import log from 'loglevel';

import { sagaCache } from './cacheStore';

export function clearSliceCache(sliceName: string): void {
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
