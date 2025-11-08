import React from 'react';

import { AppShell, Container } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import { PageLoading } from '@/features/components/PageLoading/PageLoading';

interface LayoutMainProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  children,
  fullWidth = false,
}) => {
  const location = useLocation();

  const content = (
    <React.Suspense fallback={<PageLoading />} key={location.key}>
      {children}
    </React.Suspense>
  );

  return (
    <AppShell.Main>
      {fullWidth ? content : <Container>{content}</Container>}
    </AppShell.Main>
  );
};
