import React from 'react';

import { AppShell } from '@mantine/core';

export const LayoutAside = ({
  children,
  style,
  visibleFrom,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  visibleFrom?: string;
}) => {
  return (
    <AppShell.Aside p="md" style={style} visibleFrom={visibleFrom}>
      {children}
    </AppShell.Aside>
  );
};
