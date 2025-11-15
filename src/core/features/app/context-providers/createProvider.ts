import React from 'react';

import { ProviderEntry } from './types/ProviderEntry';
import { widenProvider } from './widenProvider';

export const createProvider = <TProps,>(
  Component: React.ComponentType<React.PropsWithChildren<TProps>>,
  props?: Omit<TProps, 'children'>
): ProviderEntry => widenProvider<TProps>({ Component, props });
