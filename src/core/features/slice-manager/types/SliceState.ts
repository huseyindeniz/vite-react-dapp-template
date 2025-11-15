export interface SliceState {
  activeComponents: Set<string>; // component IDs using this slice
  isRouteActive: boolean; // is the route that uses this slice active
  lastAccessed: number;
  cleanupTimeout?: NodeJS.Timeout;
  isPinned: boolean; // manually pinned to prevent cleanup
}
