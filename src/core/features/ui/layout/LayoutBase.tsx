import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React, { ErrorInfo } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import log from 'loglevel';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { useI18nWatcher } from '@/core/features/i18n/useI18nWatchers';
import { useActiveRoute } from '@/core/features/router/hooks/useActiveRoute';
import { usePages } from '@/core/features/router/hooks/usePages';
import { MenuType } from '@/core/features/router/types/MenuType';
import { ErrorFallback } from '@/domain/layout/ErrorFallback/ErrorFallback';

const myErrorHandler = (error: Error, info: ErrorInfo) => {
  // Do something with the error
  // E.g. log to an error logging client here
  log.error(error.message);
  log.error(info.componentStack);
};

interface LayoutBaseProps {
  shellExtension?: React.FC<{
    navbarCollapsed: boolean;
    asideVisible: boolean;
    asideCollapsed: boolean;
    children: React.ReactNode;
  }>;
  headerExtension?: React.FC<{
    opened: boolean;
    toggle: () => void;
    close: () => void;
  }>;
  navbarExtension?: React.FC<{
    mainMenuItems: MenuType[];
    hasSubRoutes: boolean;
    subRoutes: MenuType[];
    close: () => void;
  }>;
  asideExtension?: React.FC<{
    hasSubRoutes: boolean;
    subRoutes: MenuType[];
  }>;
  mainExtension?: React.FC<{ fullWidth: boolean }>;
  footerExtension?: React.FC;
}

export const LayoutBase: React.FC<LayoutBaseProps> = ({
  shellExtension: ShellExtension,
  headerExtension: HeaderExtension,
  navbarExtension: NavbarExtension,
  asideExtension: AsideExtension,
  mainExtension: MainExtension,
  footerExtension: FooterExtension,
}) => {
  useI18nWatcher();
  const [opened, { toggle, close }] = useDisclosure();
  const { mainMenuItems, pageRoutes } = usePages();

  // Detect active route and check if it has subRoutes
  const { hasSubRoutes, subRoutes, fullWidth } = useActiveRoute(pageRoutes);
  const asideVisible = subRoutes.filter(r => r.menuLabel !== null).length > 0;
  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        <Notifications />
        {ShellExtension && (
          <ShellExtension
            navbarCollapsed={opened}
            asideVisible={asideVisible}
            asideCollapsed={false}
          >
            {HeaderExtension && (
              <HeaderExtension opened={opened} toggle={toggle} close={close} />
            )}

            {NavbarExtension && (
              <NavbarExtension
                mainMenuItems={mainMenuItems}
                hasSubRoutes={hasSubRoutes}
                subRoutes={subRoutes}
                close={close}
              />
            )}

            {AsideExtension && (
              <AsideExtension
                hasSubRoutes={hasSubRoutes}
                subRoutes={subRoutes}
              />
            )}

            {MainExtension && <MainExtension fullWidth={fullWidth} />}

            {FooterExtension && <FooterExtension />}
          </ShellExtension>
        )}
      </ErrorBoundary>
    </HelmetProvider>
  );
};
