import { type CSSVariablesResolver } from '@mantine/core';
// CSS Variables Resolver for light/dark mode specific values
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--app-shell-bg': '#efefef',
    '--app-shell-box-shadow': 'inset 0px 0px 20px -10px #020202',
  },
  dark: {
    '--app-shell-bg': '#020202',
    '--app-shell-box-shadow': 'inset 0px 0px 40px -10px #efefef',
  },
});
