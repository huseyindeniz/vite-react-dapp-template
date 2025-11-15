import log from 'loglevel';

import { clearSliceCache } from '../cache/clearSliceCache';

export function clearSliceCacheSaga(action: { payload: { sliceName: string } }): void {
  clearSliceCache(action.payload.sliceName);
  log.debug(`Cache cleared for slice: ${action.payload.sliceName}`);
}
