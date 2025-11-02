import type { Reducer } from '@reduxjs/toolkit';

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
