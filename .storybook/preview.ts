import type { Preview } from '@storybook/react';
import { theme } from '../src/features/ui/components/Layout/Theme/theme';

const preview: Preview = {
  parameters: {
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
