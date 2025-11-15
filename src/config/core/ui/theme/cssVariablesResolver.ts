import { type CSSVariablesResolver } from '@mantine/core';
// CSS Variables Resolver for light/dark mode specific values
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--app-shell-bg': '#efefef',
    '--app-shell-box-shadow': 'inset 0px 0px 20px -10px #020202',
    '--app-shell-header-bg': '#f5f5f5',
    '--app-shell-footer-bg': '#f5f5f5',
    '--paper-bg': '#f5f5f5',
    '--card-bg': '#f5f5f5',
  },
  dark: {
    '--app-shell-bg': '#020202',
    '--app-shell-box-shadow': 'inset 0px 0px 40px -10px #efefef',
    '--app-shell-header-bg': '#0D0D0D',
    '--app-shell-footer-bg': '#0D0D0D',
    '--paper-bg': '#0D0D0D',
    '--card-bg': '#0D0D0D',
  },
});
