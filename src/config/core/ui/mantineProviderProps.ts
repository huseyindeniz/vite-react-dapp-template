import { MantineColorScheme } from '@mantine/core';

import { cssVariablesResolver } from './theme/cssVariablesResolver';
import { theme } from './theme/theme';

// You can override other MantineProvider props here
export const mantineProviderProps = {
  theme,
  defaultColorScheme: 'auto' as MantineColorScheme,
  cssVariablesResolver,
};
