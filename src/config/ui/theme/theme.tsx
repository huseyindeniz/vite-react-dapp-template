import { AppShell, createTheme } from '@mantine/core';

// You can customize the theme object as needed
export const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  components: {
    AppShell: AppShell.extend({
      styles: {
        root: {
          backgroundColor: 'var(--app-shell-bg)',
        },
        main: {
          backgroundColor: 'transparent',
        },
        footer: {
          position: 'relative',
        },
      },
    }),
  },
});
