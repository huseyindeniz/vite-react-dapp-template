import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React, { ErrorInfo } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import log from 'loglevel';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { Breadcrumb } from '@/features/components/Breadcrumb/Breadcrumb';
import { ErrorFallback } from '@/features/components/ErrorFallback/ErrorFallback';
import { SideNav } from '@/features/components/SideNav/SideNav';
import { useI18nWatcher } from '@/features/i18n/useI18nWatchers';
import { useActiveRoute } from '@/features/router/hooks/useActiveRoute';
import { useBreadcrumb } from '@/features/router/hooks/useBreadcrumb';
import { usePages } from '@/features/router/hooks/usePages';
import { MenuType } from '@/features/router/types/MenuType';

import { Layout } from './components/Layout';

const myErrorHandler = (error: Error, info: ErrorInfo) => {
  // Do something with the error
  // E.g. log to an error logging client here
  log.error(error.message);
  log.error(info.componentStack);
};

interface LayoutBaseProps {
  shellExtension?: React.FC<{ navbarCollapsed: boolean; asideVisible: boolean; children: React.ReactNode }>;
  headerExtension?: React.FC<{ opened: boolean; toggle: () => void; close: () => void }>;
  navbarExtension?: React.FC<{
    mainMenuItems: MenuType[];
    hasSubRoutes: boolean;
    subRoutes: MenuType[];
    close: () => void;
  }>;
  footerExtension?: React.FC;
}

export const LayoutBase: React.FC<LayoutBaseProps> = ({
  shellExtension: ShellExtension,
  headerExtension: HeaderExtension,
  navbarExtension: NavbarExtension,
  footerExtension: FooterExtension,
}) => {
  useI18nWatcher();
  const [opened, { toggle, close }] = useDisclosure();
  const { mainMenuItems, pageRoutes } = usePages();

  // Detect active route and check if it has subRoutes
  const { hasSubRoutes, subRoutes, fullWidth } = useActiveRoute(pageRoutes);

  // Get breadcrumb items
  const breadcrumbItems = useBreadcrumb(pageRoutes);

  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        <Notifications />
        {ShellExtension && (
          <ShellExtension
            navbarCollapsed={opened}
            asideVisible={hasSubRoutes && !fullWidth}
          >
            <Layout.Header>
              {HeaderExtension && (
                <HeaderExtension opened={opened} toggle={toggle} close={close} />
              )}
            </Layout.Header>

            <Layout.Navbar>
              {NavbarExtension && (
                <NavbarExtension
                  mainMenuItems={mainMenuItems}
                  hasSubRoutes={hasSubRoutes}
                  subRoutes={subRoutes}
                  close={close}
                />
              )}
            </Layout.Navbar>

            {hasSubRoutes && !fullWidth && (
              <Layout.Aside>
                <SideNav items={subRoutes} />
              </Layout.Aside>
            )}

            <Layout.Content fullWidth={fullWidth}>
              <Breadcrumb items={breadcrumbItems} />
              <Outlet />
            </Layout.Content>

            <Layout.Footer>
              {FooterExtension && <FooterExtension />}
            </Layout.Footer>
          </ShellExtension>
        )}
      </ErrorBoundary>
    </HelmetProvider>
  );
};
