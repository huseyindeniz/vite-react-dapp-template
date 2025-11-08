import React from 'react';

import { AppShell } from '@mantine/core';

import { LayoutAside } from './LayoutAside';
import { LayoutContent } from './LayoutContent';
import { LayoutFooter } from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { LayoutNavbar } from './LayoutNavbar';

interface LayoutProps {
  navbarCollapsed: boolean;
  asideVisible?: boolean;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> & {
  Header: React.FC<{ children: React.ReactNode }>;
  Navbar: React.FC<{ children: React.ReactNode }>;
  Aside: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode; fullWidth?: boolean }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ navbarCollapsed, asideVisible = false, children }) => {
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

Layout.Header = LayoutHeader;
Layout.Navbar = LayoutNavbar;
Layout.Aside = LayoutAside;
Layout.Content = LayoutContent;
Layout.Footer = LayoutFooter;
