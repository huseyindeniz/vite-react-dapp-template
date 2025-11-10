import React from 'react';

import { AppShell } from '@mantine/core';

import { LAYOUT_BREAKPOINTS } from '@/config/core/ui/layout-breakpoints';

interface ShellProps {
  navbarCollapsed: boolean;
  asideVisible: boolean;
  asideCollapsed: boolean;
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
        breakpoint: LAYOUT_BREAKPOINTS.MOBILE,
        collapsed: { desktop: true, mobile: !navbarCollapsed },
      }}
      aside={{
        width: 0, // Always 0 - width managed by fixed positioning overlay in Aside.tsx
        breakpoint: LAYOUT_BREAKPOINTS.MOBILE,
        collapsed: { desktop: !asideVisible, mobile: true },
      }}
      footer={{ height: 90 }}
      padding="md"
      pb={0}
    >
      {children}
    </AppShell>
  );
};
