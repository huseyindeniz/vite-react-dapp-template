import { useCallback } from 'react';

import { getSliceManager } from '../SliceLifecycleManager';

// Hook for accessing slice manager utilities
export const useSliceManager = () => {
  const manager = getSliceManager();

  return {
    getSliceStatus: useCallback(() => manager.getSliceStatus(), []),
    getFeatureStatus: useCallback(() => manager.getFeatureStatus(), []),
    cleanupAll: useCallback(() => manager.cleanupAllInactive(), []),
    pinSlice: useCallback(
      (sliceName: string) => manager.pinSlice(sliceName),
      []
    ),
    unpinSlice: useCallback(
      (sliceName: string) => manager.unpinSlice(sliceName),
      []
    ),
    cleanupSlice: useCallback(
      (sliceName: string) => manager.manualCleanup(sliceName),
      []
    ),
    cleanupFeature: useCallback(
      (featureName: string) => manager.cleanupFeature(featureName),
      []
    ),
  };
};
