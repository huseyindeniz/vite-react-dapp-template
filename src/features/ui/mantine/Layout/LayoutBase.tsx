import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React, { ErrorInfo } from 'react';

import { Burger, Center, Divider, Group, Container, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import log from 'loglevel';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
import { useI18nWatcher } from '@/features/i18n/useI18nWatchers';
import { usePageLink } from '@/features/router/usePageLink';
import { usePages } from '@/features/router/usePages';
import { Wallet } from '@/features/wallet/components/Wallet';

import { ColorSchemeSwitch } from '../components/ColorSchemeSwitch/ColorSchemeSwitch';
import { CookieConsentMessage } from '../components/CookieConsent/CookieConsentMessage';
import { Copyright } from '../components/Copyright/Copyright';
import { ErrorFallback } from '../components/ErrorFallback/ErrorFallback';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { ScrollToTopButton } from '../components/ScrollToTopButton/ScrollToTopButton';
import { SecondaryMenu } from '../components/SecondaryMenu/SecondaryMenu';
import { SiteLogo } from '../components/SiteLogo/SiteLogo';
import { SiteMeta } from '../components/SiteMeta/SiteMeta';
import { SocialMenu } from '../components/SocialMenu/SocialMenu';

import { Layout } from './components/Layout';

const myErrorHandler = (error: Error, info: ErrorInfo) => {
  // Do something with the error
  // E.g. log to an error logging client here
  log.error(error.message);
  log.error(info.componentStack);
};

export const LayoutBase: React.FC = () => {
  useI18nWatcher();
  const { t } = useTranslation('Layout');
  const [opened, { toggle, close }] = useDisclosure();
  const { pageLink } = usePageLink();
  const { mainMenuItems, secondaryMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const siteDescription = t('SITE_DESCRIPTION');

  const baseUrl = pageLink('/');

  return (
    <HelmetProvider>
      <SiteMeta siteName={siteName} siteDescription={siteDescription} />
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        <Notifications />
        <Layout navbarCollapsed={opened}>
          <Layout.Header>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group>
              <SiteLogo siteName={siteName} baseUrl={baseUrl} />
              <Group ml="xl" gap={0} visibleFrom="sm">
                <MainMenu mainMenuItems={mainMenuItems} onClick={close} />
              </Group>
            </Group>
            <Group visibleFrom="sm">
              <LangMenu />
              <ColorSchemeSwitch />
              <Wallet />
            </Group>
          </Layout.Header>

          <Layout.Navbar>
            <MainMenu mainMenuItems={mainMenuItems} onClick={close} vertical />
            <Divider my="sm" />
            <Stack align="center" gap="sm">
              <LangMenu />
              <ColorSchemeSwitch />
              <Wallet />
            </Stack>
          </Layout.Navbar>

          <Layout.Content>
            <Container>
              <Outlet />
            </Container>
          </Layout.Content>

          <Layout.Footer>
            <Container>
              <Center>
                <SecondaryMenu secondaryMenuItems={secondaryMenuItems} />
              </Center>
              <Divider
                label={<SiteLogo siteName={siteName} baseUrl={baseUrl} />}
              />
              <Group justify="space-between" style={{ flex: 1 }} mt={-10}>
                <Copyright />
                <SocialMenu />
              </Group>
            </Container>
            <ScrollToTopButton />
            <CookieConsentMessage />
          </Layout.Footer>
        </Layout>
      </ErrorBoundary>
    </HelmetProvider>
  );
};
