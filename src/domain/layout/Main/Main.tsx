import React from 'react';

import { AppShell, Container } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';

import { useBreadcrumb } from '@/core/features/router/hooks/useBreadcrumb';
import { usePages } from '@/core/features/router/hooks/usePages';
import { Breadcrumb } from '@/domain/layout/components/Breadcrumb/Breadcrumb';
import { PageLoading } from '@/domain/layout/components/PageLoading/PageLoading';

interface MainProps {
  fullWidth: boolean;
}

export const Main: React.FC<MainProps> = ({ fullWidth }) => {
  const { pageRoutes } = usePages();
  const breadcrumbItems = useBreadcrumb(pageRoutes);
  const location = useLocation();

  const content = (
    <React.Suspense fallback={<PageLoading />} key={location.key}>
      {!fullWidth && <Breadcrumb items={breadcrumbItems} />}
      <Outlet />
    </React.Suspense>
  );

  return (
    <AppShell.Main>
      {fullWidth ? content : <Container>{content}</Container>}
    </AppShell.Main>
  );
};
