import { blogDemoFeatureConfig } from './domain/blog-demo/feature';
import { oauthFeatureConfig } from './domain/oauth/feature';
import { walletFeatureConfig } from './domain/wallet/feature';

/**
 * Centralized feature registry
 *
 * Each feature declares:
 * - store: Redux state configuration (stateKey + reducer)
 * - saga: Saga configuration (saga watcher + API dependencies)
 * - configureSliceManager: Optional slice manager configuration function
 *
 * Benefits:
 * - Single source of truth for feature configuration
 * - Automatic registration in rootReducer and store
 * - Clear separation: store vs saga concerns
 * - Clear dependency injection for sagas
 */
export const features = {
  wallet: walletFeatureConfig,
  blogDemo: blogDemoFeatureConfig,
  oauth: oauthFeatureConfig,
};
