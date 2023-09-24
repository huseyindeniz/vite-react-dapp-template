/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { theme } from '@/features/ui/components/Layout/Theme/theme';

import i18n from './i18nextMock';

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  </ChakraProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
