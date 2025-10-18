import React from 'react';

import { AppShell } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import { PageLoading } from '../../components/PageLoding/PageLoading';

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AppShell.Main>
      <React.Suspense fallback={<PageLoading />} key={location.key}>
        {children}
      </React.Suspense>
    </AppShell.Main>
  );
};
