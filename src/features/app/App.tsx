import React from 'react';

import { MantineProvider } from '@mantine/core';
import log from 'loglevel';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/features/app/store/store';
import { Router } from '@/features/router/Router';
import { theme } from '@/features/ui/mantine/theme';

import '@/features/i18n/i18n';

import { composeProviders, createProvider } from './composeContextProviders';

log.setDefaultLevel('silent');

if (import.meta.env.MODE !== 'production') {
  log.enableAll();
} else {
  log.disableAll();
}

// this is a list of providers that will be composed
// they will wrap each other in the order they are listed
const providers = [
  createProvider(ReduxProvider, { store }),
  createProvider(MantineProvider, { theme, defaultColorScheme: 'auto' }),
];

const ComposedProviders = composeProviders(providers);

export const App: React.FC = () => {
  return (
    <ComposedProviders>
      <Router />
    </ComposedProviders>
  );
};
