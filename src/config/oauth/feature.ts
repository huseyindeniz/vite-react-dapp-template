import { defineFeature } from '@/features/app/types/FeatureConfig';
import { oauthSaga } from '@/features/oauth/sagas';
import { oauthReducer } from '@/features/oauth/slice';

import { oauthService } from './services';
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
export const oauthFeatureConfig = defineFeature({
  id: 'feature-oauth',
  store: {
    stateKey: 'oauth',
    reducer: oauthReducer,
  },
  saga: {
    saga: oauthSaga,
    dependencies: [oauthService],
  },
});
