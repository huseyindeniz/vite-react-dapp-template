import type { Reducer } from '@reduxjs/toolkit';
import type { Saga } from 'redux-saga';

/**
 * Redux store configuration for a feature
 * Contains everything related to the Redux state tree
 */
export interface FeatureStore<TState = unknown> {
  /**
   * The key used in the Redux state tree
   * e.g., 'wallet' results in state.wallet
   */
  stateKey: string;

  /**
   * The feature's root reducer (from feature/slice.ts)
   */
  reducer: Reducer<TState>;
}

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

/**
 * Complete feature configuration for centralized feature registration
 * Used in src/features/app/config/features.ts
 */
export interface FeatureConfig<TState = unknown> {
  /**
   * Whether this feature is enabled
   * Disabled features won't have their store/saga registered
   */
  enabled: boolean;

  /**
   * Redux store configuration (state key + reducer)
   */
  store: FeatureStore<TState>;

  /**
   * Saga configuration (saga watcher + dependencies)
   */
  saga: FeatureSaga;

  /**
   * Optional: Slice manager configuration function
   * Called by Router after slice manager is ready
   * Use for registering feature routes and slices with slice manager
   */
  configureSliceManager?: () => void;
}