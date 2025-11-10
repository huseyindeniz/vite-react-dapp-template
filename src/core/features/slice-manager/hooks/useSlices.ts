import { useCallback, useEffect, useRef } from 'react';

import { getSliceManager } from '../SliceLifecycleManager';

// Hook for components to register with specific slices
export const useSlices = (sliceNames: string | string[]) => {
  const slices = Array.isArray(sliceNames) ? sliceNames : [sliceNames];
  const componentId = useRef(
    `comp-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  useEffect(() => {
    const manager = getSliceManager();
    manager.registerComponent(componentId, slices);

    return () => {
      manager.unregisterComponent(componentId);
    };
  }, [componentId, ...slices]);

  const manager = getSliceManager();

  return {
    pinSlice: useCallback((sliceName: string) => {
      manager.pinSlice(sliceName);
    }, []),

    unpinSlice: useCallback((sliceName: string) => {
      manager.unpinSlice(sliceName);
    }, []),

    manualCleanup: useCallback(
      (sliceName?: string) => {
        if (sliceName) {
          manager.manualCleanup(sliceName);
        } else {
          slices.forEach(s => manager.manualCleanup(s));
        }
      },
      [slices]
    ),
  };
};
