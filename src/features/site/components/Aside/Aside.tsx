import React from 'react';

import { ActionIcon, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { SideNav } from '@/features/components/SideNav/SideNav';
import { Layout } from '@/features/layout/components/Layout';
import { MenuType } from '@/features/router/types/MenuType';

interface AsideProps {
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
}

export const Aside: React.FC<AsideProps> = ({ hasSubRoutes, subRoutes }) => {
  const [collapsed, { toggle }] = useDisclosure(false); // Default: expanded
  const isMobile = useMediaQuery('(max-width: 87.5em)'); // xl breakpoint

  if (!hasSubRoutes) {
    return null;
  }

  // Filter to only show routes with menuLabel (excludes dynamic routes like blog posts)
  const menuRoutes = subRoutes.filter(route => route.menuLabel !== null);

  // Don't render if no menu-worthy routes
  if (menuRoutes.length === 0) {
    return null;
  }

  // Hide completely on mobile
  if (isMobile) {
    return null;
  }

  const drawerSize = collapsed ? 60 : 200;

  return (
    <Layout.Aside opened size={drawerSize}>
      <Stack gap="xs" p="xs" style={{ height: '100%' }}>
        <ActionIcon
          onClick={toggle}
          variant="default"
          size="md"
          aria-label="Toggle aside menu"
        >
          {collapsed ? (
            <MdKeyboardArrowLeft size={20} />
          ) : (
            <MdKeyboardArrowRight size={20} />
          )}
        </ActionIcon>
        <SideNav items={menuRoutes} collapsed={collapsed} />
      </Stack>
    </Layout.Aside>
  );
};
