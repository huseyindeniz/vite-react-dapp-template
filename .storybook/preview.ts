import type { Preview } from '@storybook/react';
import { theme } from '../src/features/ui/components/Layout/Theme/theme';

import i18n from './i18n';

const preview: Preview = {
  globals: {
    locale: 'en-US',
    locales: {
      'en-US': 'English (US)',
      'tr-TR': 'Türkçe',
    },
  },
  parameters: {
    i18n,
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    chakra: { theme: theme },
  },
};

export default preview;
