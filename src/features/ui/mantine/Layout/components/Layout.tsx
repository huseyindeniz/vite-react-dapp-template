import React from 'react';

import { AppShell } from '@mantine/core';

import { LayoutContent } from './LayoutContent';
import { LayoutFooter } from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { LayoutNavbar } from './LayoutNavbar';

interface LayoutProps {
  navbarCollapsed: boolean;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> & {
  Header: React.FC<{ children: React.ReactNode }>;
  Navbar: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ navbarCollapsed, children }) => {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !navbarCollapsed },
      }}
      footer={{ height: 150 }}
      padding="md"
    >
      {children}
    </AppShell>
  );
};

Layout.Header = LayoutHeader;
Layout.Navbar = LayoutNavbar;
Layout.Content = LayoutContent;
Layout.Footer = LayoutFooter;
