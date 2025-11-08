import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React, { ErrorInfo } from 'react';

import {
  Burger,
  Center,
  Divider,
  Group,
  Container,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import log from 'loglevel';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { useI18nWatcher } from '@/features/i18n/useI18nWatchers';
import { useActiveRoute } from '@/features/router/hooks/useActiveRoute';
import { useBreadcrumb } from '@/features/router/hooks/useBreadcrumb';
import { usePageLink } from '@/features/router/hooks/usePageLink';
import { usePages } from '@/features/router/hooks/usePages';

import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';
import { CookieConsentMessage } from '../components/CookieConsent/CookieConsentMessage';
import { Copyright } from '../components/Copyright/Copyright';
import { ErrorFallback } from '../components/ErrorFallback/ErrorFallback';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { ScrollToTopButton } from '../components/ScrollToTopButton/ScrollToTopButton';
import { SecondaryMenu } from '../components/SecondaryMenu/SecondaryMenu';
import { SideNav } from '../components/SideNav/SideNav';
import { SiteLogo } from '../components/SiteLogo/SiteLogo';

import { Layout } from './components/Layout';

const myErrorHandler = (error: Error, info: ErrorInfo) => {
  // Do something with the error
  // E.g. log to an error logging client here
  log.error(error.message);
  log.error(info.componentStack);
};

interface LayoutBaseProps {
  headerExtension?: React.FC;
  navbarExtension?: React.FC;
  socialMenuExtension?: React.FC;
}

export const LayoutBase: React.FC<LayoutBaseProps> = ({
  headerExtension: HeaderExtension,
  navbarExtension: NavbarExtension,
  socialMenuExtension: SocialMenuExtension,
}) => {
  useI18nWatcher();
  const { t } = useTranslation('app');
  const [opened, { toggle, close }] = useDisclosure();
  const { pageLink } = usePageLink();
  const { mainMenuItems, secondaryMenuItems, pageRoutes } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  // Detect active route and check if it has subRoutes
  const { hasSubRoutes, subRoutes, fullWidth } = useActiveRoute(pageRoutes);

  // Get breadcrumb items
  const breadcrumbItems = useBreadcrumb(pageRoutes);

  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        <Notifications />
        <Layout
          navbarCollapsed={opened}
          asideVisible={
            hasSubRoutes && subRoutes.filter(r => r.menuLabel).length > 0
          }
        >
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
              {HeaderExtension && <HeaderExtension />}
            </Group>
          </Layout.Header>

          <Layout.Navbar>
            <MainMenu mainMenuItems={mainMenuItems} onClick={close} vertical />
            {hasSubRoutes && (
              <>
                <Divider my="sm" />
                <SideNav items={subRoutes} />
              </>
            )}
            <Divider my="sm" />
            <Stack align="center" gap="sm">
              {NavbarExtension && <NavbarExtension />}
            </Stack>
          </Layout.Navbar>

          {hasSubRoutes && subRoutes.filter(r => r.menuLabel).length > 0 && (
            <Layout.Aside>
              <SideNav items={subRoutes} />
            </Layout.Aside>
          )}

          <Layout.Content fullWidth={fullWidth}>
            <Breadcrumb items={breadcrumbItems} />
            <Outlet />
          </Layout.Content>

          <Layout.Footer>
            <Container>
              <Center>
                <SecondaryMenu secondaryMenuItems={secondaryMenuItems} />
              </Center>
              <Divider
                label={
                  <Stack gap={0} align="center" justify="center">
                    <SiteLogo siteName={siteName} baseUrl={baseUrl} />
                    <Text c="dimmed" fz="xs">
                      v{__VITE_REACT_APP_VERSION__}
                    </Text>
                  </Stack>
                }
              />
              <Group justify="space-between" style={{ flex: 1 }} mt={-10}>
                <Copyright />
                {SocialMenuExtension && <SocialMenuExtension />}
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
