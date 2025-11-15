import { MantineColorScheme } from '@mantine/core';

import { cssVariablesResolver } from './theme/cssVariablesResolver';
import { theme } from './theme/theme';

// UI feature flags
export const uiConfig = {
  showColorSchemeSwitch: true, // Set to true to show dark/light mode toggle
};

// You can override other MantineProvider props here
export const mantineProviderProps = {
  theme,
  defaultColorScheme: 'auto' as MantineColorScheme,
  cssVariablesResolver,
};
