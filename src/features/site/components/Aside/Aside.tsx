import React from 'react';

import { SideNav } from '@/features/components/SideNav/SideNav';
import { Layout } from '@/features/layout/components/Layout';
import { MenuType } from '@/features/router/types/MenuType';

interface AsideProps {
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
}

export const Aside: React.FC<AsideProps> = ({ hasSubRoutes, subRoutes }) => {
  if (!hasSubRoutes) {
    return null;
  }

  // Filter to only show routes with menuLabel (excludes dynamic routes like blog posts)
  const menuRoutes = subRoutes.filter(route => route.menuLabel !== null);

  // Don't render if no menu-worthy routes
  if (menuRoutes.length === 0) {
    return null;
  }

  return (
    <Layout.Aside
      style={{
        position: 'fixed',
        right: 0,
        top: 60, // Header height
        height: 'calc(100vh - 60px)',
        width: '240px',
        zIndex: 200,
      }}
    >
      <SideNav items={menuRoutes} />
    </Layout.Aside>
  );
};
