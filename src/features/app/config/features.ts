import { configureBlogFeature } from '@/features/blog-demo/configureBlogFeature';
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import { blogDemoReducer } from '@/features/blog-demo/slice';
import { oauthSaga } from '@/features/oauth/sagas';
import { oauthReducer } from '@/features/oauth/slice';
import { watchWalletSaga } from '@/features/wallet/sagas';
import { walletReducer } from '@/features/wallet/slice';

import { authService, blogDemoApi, walletApi } from './services';

/**
 * Centralized feature registry
 *
 * Each feature declares:
 * - enabled: Whether feature is active
 * - store: Redux state configuration (stateKey + reducer)
 * - saga: Saga configuration (saga watcher + API dependencies)
 * - configureSliceManager: Optional slice manager configuration function
 *
 * Benefits:
 * - Single source of truth for feature configuration
 * - Easy to enable/disable features
 * - Automatic registration in rootReducer and store
 * - Clear separation: store vs saga concerns
 * - Clear dependency injection for sagas
 */
export const features = {
  wallet: {
    enabled: true,
    store: {
      stateKey: 'wallet',
      reducer: walletReducer,
    },
    saga: {
      saga: watchWalletSaga,
      dependencies: [walletApi],
    },
  },
  blogDemo: {
    enabled: true,
    store: {
      stateKey: 'blogDemo',
      reducer: blogDemoReducer,
    },
    saga: {
      saga: watchBlogDemoSaga,
      dependencies: [blogDemoApi],
    },
    configureSliceManager: configureBlogFeature,
  },
  oauth: {
    enabled: true,
    store: {
      stateKey: 'oauth',
      reducer: oauthReducer,
    },
    saga: {
      saga: oauthSaga,
      dependencies: [authService],
    },
  },
};
