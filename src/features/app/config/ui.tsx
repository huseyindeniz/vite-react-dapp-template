import { createTheme, MantineColorScheme } from '@mantine/core';

// You can customize the theme object as needed
const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
});

// You can override other MantineProvider props here
export const mantineProviderProps = {
  theme,
  defaultColorScheme: 'auto' as MantineColorScheme,
};
