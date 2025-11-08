import React from 'react';

import { LayoutAside } from './LayoutAside';
import { LayoutContent } from './LayoutContent';
import { LayoutFooter } from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { LayoutNavbar } from './LayoutNavbar';

// Layout namespace for subcomponents only
export const Layout = {
  Header: LayoutHeader,
  Navbar: LayoutNavbar,
  Aside: LayoutAside,
  Content: LayoutContent,
  Footer: LayoutFooter,
} as {
  Header: React.FC<{ children: React.ReactNode }>;
  Navbar: React.FC<{ children: React.ReactNode }>;
  Aside: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode; fullWidth?: boolean }>;
  Footer: React.FC<{ children: React.ReactNode }>;
};
