import { getSliceManager } from '@/features/slice-manager/SliceLifecycleManager';
import { FeatureRouteConfig } from '@/features/slice-manager/types/FeatureRouteConfig';
import { SliceConfig } from '@/features/slice-manager/types/SliceConfig';

export const BlogSlices = {
  POSTS: 'posts',
  AUTHORS: 'authors',
  CATEGORIES: 'categories',
  COMMENTS: 'comments',
  BLOG_SETTINGS: 'blogSettings',
} as const;

// Configuration for your blog feature
export const configureBlogFeature = () => {
  const manager = getSliceManager();

  // Register the blog feature with its routes
  const blogFeatureConfig: FeatureRouteConfig = {
    name: 'blogDemo',
    routes: [
      /^\/blog($|\/)/, // /blog, /blog/, /blog/anything
    ],
    slices: [
      BlogSlices.POSTS,
      BlogSlices.AUTHORS,
      BlogSlices.CATEGORIES,
      BlogSlices.COMMENTS,
      BlogSlices.BLOG_SETTINGS,
    ],
  };

  manager.registerFeature(blogFeatureConfig);

  // Register individual slices with their specific strategies
  const blogSliceConfigs: SliceConfig[] = [
    {
      name: BlogSlices.POSTS,
      feature: 'blogDemo',
      cleanupStrategy: 'cached', // Clean when leaving blog routes
      cacheTimeout: 1000 * 60 * 10, // 10 minutes cache
      cleanupReducerName: 'cleanup', // Use the 'cleanup' action for cleanup
      cleanupDelay: 1000 * 3, // Wait 3 seconds before cleanup
    },
    {
      name: BlogSlices.AUTHORS,
      feature: 'blogDemo',
      cleanupStrategy: 'cached', // Keep cached for longer
      cacheTimeout: 600000, // 10 minutes cache
      cleanupReducerName: 'cleanup',
      cleanupDelay: 1000,
    },
    {
      name: BlogSlices.CATEGORIES,
      feature: 'blogDemo',
      cleanupStrategy: 'persistent', // Never cleanup automatically
      cleanupReducerName: 'cleanup',
    },
    {
      name: BlogSlices.COMMENTS,
      feature: 'blogDemo',
      cleanupStrategy: 'component', // Clean when components unmount
      cleanupReducerName: 'cleanup',
      cleanupDelay: 5000, // Wait 5 seconds
    },
    {
      name: BlogSlices.BLOG_SETTINGS,
      feature: 'blogDemo',
      cleanupStrategy: 'persistent', // Keep settings always
      cleanupReducerName: 'cleanup',
    },
  ];

  blogSliceConfigs.forEach(config => {
    manager.registerSlice(config);
  });
};
