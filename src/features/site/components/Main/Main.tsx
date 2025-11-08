import React from 'react';

import { Outlet } from 'react-router-dom';

import { Breadcrumb } from '@/features/components/Breadcrumb/Breadcrumb';
import { Layout } from '@/features/layout/components/Layout';
import { useBreadcrumb } from '@/features/router/hooks/useBreadcrumb';
import { usePages } from '@/features/router/hooks/usePages';

interface MainProps {
  fullWidth: boolean;
}

export const Main: React.FC<MainProps> = ({ fullWidth }) => {
  const { pageRoutes } = usePages();
  const breadcrumbItems = useBreadcrumb(pageRoutes);

  return (
    <Layout.Main fullWidth={fullWidth}>
      {!fullWidth && <Breadcrumb items={breadcrumbItems} />}
      <Outlet />
    </Layout.Main>
  );
};
