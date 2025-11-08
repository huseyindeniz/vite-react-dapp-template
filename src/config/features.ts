import { defineFeature } from '@/features/app/types/FeatureConfig';
import { configureSlice as configureBlogDemoSlice } from '@/features/blog-demo/configureSlice';
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import { blogDemoReducer } from '@/features/blog-demo/slice';
import { oauthSaga } from '@/features/oauth/sagas';
import { oauthReducer } from '@/features/oauth/slice';
import { watchWalletSaga } from '@/features/wallet/sagas';
import { walletReducer } from '@/features/wallet/slice';

import { oauthService, blogDemoApi, walletApi } from './services';

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
  wallet: defineFeature({
    store: {
      stateKey: 'wallet',
      reducer: walletReducer,
    },
    saga: {
      saga: watchWalletSaga,
      dependencies: [walletApi],
    },
  }),
  blogDemo: defineFeature({
    store: {
      stateKey: 'blogDemo',
      reducer: blogDemoReducer,
    },
    saga: {
      saga: watchBlogDemoSaga,
      dependencies: [blogDemoApi],
    },
    configureSlice: configureBlogDemoSlice,
  }),
  oauth: defineFeature({
    store: {
      stateKey: 'oauth',
      reducer: oauthReducer,
    },
    saga: {
      saga: oauthSaga,
      dependencies: [oauthService],
    },
  }),
};
