import type { Reducer } from '@reduxjs/toolkit';

/**
 * Complete feature configuration for centralized feature registration
 * Used in src/config/features.ts
 */
export interface FeatureConfig<
  TStateKey extends string,
  TState,
  TSagaFn
> {
  /**
   * Redux store configuration (state key + reducer)
   */
  store: {
    /**
     * The key used in the Redux state tree
     * e.g., 'wallet' results in state.wallet
     */
    stateKey: TStateKey;

    /**
     * The feature's root reducer (from feature/slice.ts)
     */
    reducer: Reducer<TState>;
  };

  /**
   * Saga configuration (saga watcher + dependencies)
   */
  saga: {
    /**
     * The feature's root saga watcher (from feature/sagas.ts)
     */
    saga: TSagaFn;

    /**
     * Dependencies injected into the saga constructor
     * Array of arguments passed to the saga (e.g., services, config, etc.)
     * TYPE-SAFE: Must match saga function parameters
     */
    dependencies?: TSagaFn extends (...args: infer P) => unknown ? P : never;
  };

  /**
   * Optional: Slice manager configuration function
   * Called by Router after slice manager is ready
   * Use for registering feature routes and slices with slice manager
   */
  configureSlice?: () => void;
}

/**
 * Helper to create type-safe feature config
 * Infers all generic types automatically from provided values
 */
export const defineFeature = <
  TStateKey extends string,
  TState,
  TSagaFn
>(
  config: FeatureConfig<TStateKey, TState, TSagaFn>
): FeatureConfig<TStateKey, TState, TSagaFn> => config;
