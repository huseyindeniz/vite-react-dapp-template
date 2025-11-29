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
    close: () => void;
  }>;
  asideExtension?: React.FC;
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
  const { pageRoutes } = usePages();
  const { subRouteHasMenuItems, fullWidth } = useActiveRoute(pageRoutes);
  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        <Notifications />
        {ShellExtension && (
          <ShellExtension
            navbarCollapsed={opened}
            asideVisible={subRouteHasMenuItems}
            asideCollapsed={false}
          >
            {HeaderExtension && (
              <HeaderExtension opened={opened} toggle={toggle} close={close} />
            )}

            {NavbarExtension && <NavbarExtension close={close} />}

            {AsideExtension && <AsideExtension />}

            {MainExtension && <MainExtension fullWidth={fullWidth} />}

            {FooterExtension && <FooterExtension />}
          </ShellExtension>
        )}
      </ErrorBoundary>
    </HelmetProvider>
  );
};
