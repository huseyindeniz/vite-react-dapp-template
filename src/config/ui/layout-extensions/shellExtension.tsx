import React from 'react';

import { Shell } from '@/features/site/components/Shell/Shell';

interface ShellExtensionProps {
  navbarCollapsed: boolean;
  asideVisible: boolean;
  children: React.ReactNode;
}

export const ShellExtension: React.FC<ShellExtensionProps> = ({
  navbarCollapsed,
  asideVisible,
  children,
}) => {
  return (
    <Shell navbarCollapsed={navbarCollapsed} asideVisible={asideVisible}>
      {children}
    </Shell>
  );
};
