import { FeatureSaga } from './FeatureSaga';
import { FeatureStore } from './FeatureStore';

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
