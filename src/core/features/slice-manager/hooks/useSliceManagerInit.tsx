import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { features } from '@/config/features';

import {
  initializeSliceManager,
  SliceLifecycleManager,
} from '../SliceLifecycleManager';

// Hook for initializing slice manager (use in Router.tsx)
export const useSliceManagerInit = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Synchronous initialization using lazy state initialization
  // This ensures manager is available immediately on first render
  const [manager] = useState<SliceLifecycleManager>(() => {
    const sliceManager = initializeSliceManager(dispatch);

    // Configure all features synchronously before first render completes
    Object.values(features).forEach(feature => {
      if (
        'configureSlice' in feature &&
        typeof feature.configureSlice === 'function'
      ) {
        feature.configureSlice();
      }
    });

    return sliceManager;
  });

  // Handle route changes
  useEffect(() => {
    manager.handleRouteChange(location.pathname);
  }, [location.pathname, manager]);

  return manager;
};
