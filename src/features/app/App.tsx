import React from 'react';

import { MantineProvider } from '@mantine/core';
import log from 'loglevel';
import { Provider as ReduxProvider } from 'react-redux';

import { mantineProviderProps } from '@/config/ui/mantineProviderProps';
import { store } from '@/features/app/store/store';
import { Router } from '@/features/router/Router';

import '@/features/i18n/i18n';

// Register auth providers (composition root)
import '@/config/auth/auth';

import { composeProviders } from './context-providers/composeProviders';
import { createProvider } from './context-providers/createProvider';

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
  createProvider(MantineProvider, {
    theme: mantineProviderProps.theme,
    defaultColorScheme: mantineProviderProps.defaultColorScheme,
    cssVariablesResolver: mantineProviderProps.cssVariablesResolver,
  }),
];

const ComposedProviders = composeProviders(providers);

export const App: React.FC = () => {
  return (
    <ComposedProviders>
      <Router />
    </ComposedProviders>
  );
};
