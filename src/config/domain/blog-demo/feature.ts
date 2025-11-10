import { defineFeature } from '@/core/features/app/types/FeatureConfig';
import { configureSlice as configureBlogDemoSlice } from '@/domain/features/blog-demo/configureSlice';
import { watchBlogDemoSaga } from '@/domain/features/blog-demo/sagas';
import { blogDemoReducer } from '@/domain/features/blog-demo/slice';

import { blogDemoApi } from './services';

export const blogDemoFeatureConfig = defineFeature({
  id: 'feature-blog-demo',
  store: {
    stateKey: 'blogDemo',
    reducer: blogDemoReducer,
  },
  saga: {
    saga: watchBlogDemoSaga,
    dependencies: [blogDemoApi],
  },
  configureSlice: configureBlogDemoSlice,
});
