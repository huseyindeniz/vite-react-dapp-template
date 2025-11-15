import { AppShell, Card, createTheme, Paper } from '@mantine/core';

// You can customize the theme object as needed
export const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  components: {
    AppShell: AppShell.extend({
      styles: {
        root: {
          backgroundColor: 'var(--app-shell-bg)',
        },
        header: {
          backgroundColor: 'var(--app-shell-header-bg)',
        },
        main: {
          backgroundColor: 'transparent',
          minHeight: 'calc(100vh - var(--app-shell-footer-height, 0px))',
        },
        footer: {
          position: 'relative',
          backgroundColor: 'var(--app-shell-footer-bg)',
        },
      },
    }),
    Paper: Paper.extend({
      styles: {
        root: {
          backgroundColor: 'var(--paper-bg)',
        },
      },
    }),
    Card: Card.extend({
      styles: {
        root: {
          backgroundColor: 'var(--card-bg)',
        },
      },
    }),
  },
});
