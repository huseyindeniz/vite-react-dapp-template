import { EnhancedStore } from '@reduxjs/toolkit';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';

import './features/i18n/i18n';

import { theme } from './features/ui/components/Layout/Theme/theme';
import { Router } from './pages/Router';

log.setDefaultLevel('silent');

if (process.env.NODE_ENV !== 'production') {
  log.enableAll();
} else {
  log.disableAll();
}

const Provider = React.lazy(() =>
  import(/* webpackChunkName: "Redux" */ 'react-redux').then(module => ({
    default: module.Provider,
  }))
);

const StoreLoader = React.lazy(() =>
  import(/* webpackChunkName: "Store" */ './store/StoreLoader').then(
    module => ({
      default: module.StoreLoader,
    })
  )
);

const ChakraProvider = React.lazy(() =>
  import(/* webpackChunkName: "ChakraUI" */ '@chakra-ui/react').then(
    module => ({
      default: module.ChakraProvider,
    })
  )
);

export const App: React.FC = () => {
  const [store, setStore] = useState<EnhancedStore>();

  useEffect(() => {
    if (!store) {
      return;
    }
    // Use lazy loaded module store
  }, [store]);

  const handleStoreLoaded = (module: EnhancedStore) => {
    // Careful, always do it using a function,
    // else the module itself will be initialized!
    setStore(() => module);
  };

  if (!store) {
    // Lazy load it
    return <StoreLoader onLoaded={handleStoreLoaded} />;
  }

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router />
      </ChakraProvider>
    </Provider>
  );
};
