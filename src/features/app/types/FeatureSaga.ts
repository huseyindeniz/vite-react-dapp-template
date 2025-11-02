import type { Saga } from 'redux-saga';

/**
 * Saga configuration for a feature
 * Contains the saga watcher and its constructor dependencies
 */
export interface FeatureSaga {
  /**
   * The feature's root saga watcher (from feature/sagas.ts)
   */
  saga: Saga;

  /**
   * Optional: Dependencies injected into the saga constructor
   * Array of arguments passed to the saga (e.g., services, config, etc.)
   */
  dependencies?: unknown[];
}
