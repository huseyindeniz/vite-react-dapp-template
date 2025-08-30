import { getSliceManager } from '@/features/slice-manager/SliceLifecycleManager';
import { FeatureRouteConfig } from '@/features/slice-manager/types/FeatureRouteConfig';
import { SliceConfig } from '@/features/slice-manager/types/SliceConfig';

// Configuration for your blog feature
export const configureBlogFeature = () => {
  const manager = getSliceManager();

  // Register the blog feature with its routes
  const blogFeatureConfig: FeatureRouteConfig = {
    name: 'blogDemo',
    routes: [
      /^\/blog($|\/)/, // /blog, /blog/, /blog/anything
      /^\/articles($|\/)/, // Alternative blog routes if any
    ],
    slices: ['posts', 'authors', 'categories', 'comments', 'blogSettings'],
  };

  manager.registerFeature(blogFeatureConfig);

  // Register individual slices with their specific strategies
  const blogSliceConfigs: SliceConfig[] = [
    {
      name: 'posts',
      feature: 'blogDemo',
      cleanupStrategy: 'cached', // Clean when leaving blog routes
      cacheTimeout: 600000, // 10 minutes cache
      cleanupReducerName: 'cleanup', // Use the 'cleanup' action for cleanup
      cleanupDelay: 3000, // Wait 3 seconds before cleanup
    },
    {
      name: 'authors',
      feature: 'blogDemo',
      cleanupStrategy: 'cached', // Keep cached for longer
      cacheTimeout: 600000, // 10 minutes cache
      cleanupReducerName: 'cleanup',
      cleanupDelay: 1000,
    },
    {
      name: 'categories',
      feature: 'blogDemo',
      cleanupStrategy: 'persistent', // Never cleanup automatically
      cleanupReducerName: 'cleanup',
    },
    {
      name: 'comments',
      feature: 'blogDemo',
      cleanupStrategy: 'component', // Clean when components unmount
      cleanupReducerName: 'cleanup',
      cleanupDelay: 5000, // Wait 5 seconds
    },
    {
      name: 'blogSettings',
      feature: 'blogDemo',
      cleanupStrategy: 'persistent', // Keep settings always
      cleanupReducerName: 'cleanup',
    },
  ];

  blogSliceConfigs.forEach(config => {
    manager.registerSlice(config);
  });
};
