import log from 'loglevel';
import React from 'react';
import { Provider } from 'react-redux';

import { Router } from './pages/Router';
import store from './store/store';

import './features/i18n/i18n';

log.setDefaultLevel('silent');

if (import.meta.env.MODE !== 'production') {
  log.enableAll();
} else {
  log.disableAll();
}

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};
