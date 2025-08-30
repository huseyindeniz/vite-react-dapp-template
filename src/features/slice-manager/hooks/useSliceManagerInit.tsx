import { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  initializeSliceManager,
  SliceLifecycleManager,
} from '../SliceLifecycleManager';

// Hook for initializing slice manager (use in App.tsx)
export const useSliceManagerInit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const managerRef = useRef<SliceLifecycleManager | null>(null);

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = initializeSliceManager(dispatch);
    }
  }, [dispatch]);

  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.handleRouteChange(location.pathname);
    }
  }, [location.pathname]);

  return managerRef.current;
};
