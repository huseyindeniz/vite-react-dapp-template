import { EnhancedStore } from '@reduxjs/toolkit';
import { useEffect } from 'react';

import store from './store';

export interface StoreLoaderProps {
  onLoaded: (store: EnhancedStore) => void;
}

export const StoreLoader: React.FC<StoreLoaderProps> = ({ onLoaded }) => {
  useEffect(() => {
    onLoaded(store);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
