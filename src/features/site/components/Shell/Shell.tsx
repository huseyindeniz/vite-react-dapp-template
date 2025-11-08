import React from 'react';

import { AppShell } from '@mantine/core';

interface ShellProps {
  navbarCollapsed: boolean;
  asideVisible: boolean;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  navbarCollapsed,
  asideVisible,
  children,
}) => {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !navbarCollapsed },
      }}
      aside={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { desktop: !asideVisible, mobile: true },
      }}
      padding="md"
    >
      {children}
    </AppShell>
  );
};
