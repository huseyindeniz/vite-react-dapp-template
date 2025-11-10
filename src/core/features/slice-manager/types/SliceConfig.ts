export interface SliceConfig {
  name: string; // e.g., 'blogPosts', 'authors', 'comments'
  feature: string; // e.g., 'blog'
  cleanupStrategy: 'component' | 'route' | 'manual' | 'cached' | 'persistent';
  cleanupReducerName: string; // specific reducer action to call for cleanup
  cleanupDelay?: number; // milliseconds for delayed cleanup
  cacheTimeout?: number; // cache expiry in milliseconds
  routes?: RegExp[]; // specific routes that should trigger cleanup
  dependencies?: string[]; // other slices this depends on
}
