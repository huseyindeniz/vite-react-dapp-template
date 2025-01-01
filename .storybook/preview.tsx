import '@mantine/core/styles.css';

import React, { Suspense, useEffect } from 'react';

import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import { addons } from '@storybook/preview-api';
import { I18nextProvider } from 'react-i18next';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { theme } from '../src/features/ui/mantine/theme';

import i18n from './i18n';

const channel = addons.getChannel();

export const parameters = {
  i18n,
  layout: 'fullscreen',
  options: {
    showPanel: false,
  },
};

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? 'dark' : 'light');

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return children;
}

const withI18next = Story => {
  return (
    // This catches the suspense from components not yet ready (still loading translations)
    // Alternative: set useSuspense to false on i18next.options.react when initializing i18next
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};

export const decorators = [
  withI18next,
  (renderStory: any) => (
    <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>
  ),
  (renderStory: any) => (
    <MantineProvider theme={theme}>{renderStory()}</MantineProvider>
  ),
];

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en-US', title: 'English' },
        { value: 'tr-TR', title: 'Türkçe' },
      ],
      showName: true,
    },
  },
};
