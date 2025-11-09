import { defineFeature } from '@/features/app/types/FeatureConfig';
import { configureSlice as configureBlogDemoSlice } from '@/features/blog-demo/configureSlice';
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import { blogDemoReducer } from '@/features/blog-demo/slice';

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
