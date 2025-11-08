import React from 'react';

import { AppShell, Container } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import { PageLoading } from '../../components/PageLoding/PageLoading';

interface LayoutContentProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const LayoutContent: React.FC<LayoutContentProps> = ({
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
