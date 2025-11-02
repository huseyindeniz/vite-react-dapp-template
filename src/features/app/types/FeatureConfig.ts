import { FeatureSaga } from './FeatureSaga';
import { FeatureStore } from './FeatureStore';

/**
 * Complete feature configuration for centralized feature registration
 * Used in src/features/app/config/features.ts
 */
export interface FeatureConfig {
  /**
   * Redux store configuration (state key + reducer)
   */
  store: FeatureStore;

  /**
   * Saga configuration (saga watcher + dependencies)
   */
  saga: FeatureSaga;

  /**
   * Optional: Slice manager configuration function
   * Called by Router after slice manager is ready
   * Use for registering feature routes and slices with slice manager
   */
  configureSlice?: () => void;
}
