import React from 'react';

import { Shell } from '@/features/site/components/Shell/Shell';

interface ShellExtensionProps {
  navbarCollapsed: boolean;
  asideVisible: boolean;
  asideCollapsed: boolean;
  children: React.ReactNode;
}

export const ShellExtension: React.FC<ShellExtensionProps> = ({
  navbarCollapsed,
  asideVisible,
  asideCollapsed,
  children,
}) => {
  return (
    <Shell
      navbarCollapsed={navbarCollapsed}
      asideVisible={asideVisible}
      asideCollapsed={asideCollapsed}
    >
      {children}
    </Shell>
  );
};
