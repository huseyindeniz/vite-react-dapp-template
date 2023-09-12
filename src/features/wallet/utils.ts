/* istanbul ignore file */
import { delay } from 'redux-saga/effects';

import { SLOW_DOWN_IN_MS } from './config';

export function* SlowDown() {
  yield delay(SLOW_DOWN_IN_MS);
}
