import React from 'react';

import { LayoutAside } from './LayoutAside';
import { LayoutFooter } from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { LayoutMain } from './LayoutMain';
import { LayoutNavbar } from './LayoutNavbar';

// Layout namespace for subcomponents only
export const Layout = {
  Header: LayoutHeader,
  Navbar: LayoutNavbar,
  Aside: LayoutAside,
  Main: LayoutMain,
  Footer: LayoutFooter,
} as {
  Header: React.FC<{ children: React.ReactNode }>;
  Navbar: React.FC<{ children: React.ReactNode }>;
  Aside: React.FC<{ children: React.ReactNode }>;
  Main: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
};
