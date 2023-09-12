import React from 'react';
import log from 'loglevel';

import './features/i18n/i18n';
import { theme } from './features/ui/components/Layout/Theme/theme';
import store from './store/store';
import { Router } from './pages/Router';

log.setDefaultLevel('silent');

if (import.meta.env.MODE !== 'production') {
  log.enableAll();
} else {
  log.disableAll();
}

const Provider = React.lazy(() =>
  import(/* webpackChunkName: "Redux" */ 'react-redux').then(module => ({
    default: module.Provider,
  }))
);

const ChakraProvider = React.lazy(() =>
  import(/* webpackChunkName: "ChakraUI" */ '@chakra-ui/react').then(
    module => ({
      default: module.ChakraProvider,
    })
  )
);

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router />
      </ChakraProvider>
    </Provider>
  );
};
