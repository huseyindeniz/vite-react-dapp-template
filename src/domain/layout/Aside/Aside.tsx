import React from 'react';

import { ActionIcon, Drawer, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { MenuType } from '@/core/features/router/types/MenuType';

import { SideNav } from '../SideNav/SideNav';

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
    <Drawer
      opened
      onClose={() => {}} // No-op, controlled externally
      position="right"
      size={drawerSize}
      withCloseButton={false}
      withOverlay={false}
      offset={60}
      removeScrollProps={{ enabled: false }}
      styles={{
        content: {
          marginRight: 0,
          height: 'auto',
        },
        body: {
          padding: 0,
          margin: 0,
        },
      }}
    >
      <Stack gap="xs" p="xs" style={{ height: '100%' }}>
        <ActionIcon onClick={toggle} variant="default" size="md">
          {collapsed ? (
            <MdKeyboardArrowLeft size={20} />
          ) : (
            <MdKeyboardArrowRight size={20} />
          )}
        </ActionIcon>
        <SideNav items={menuRoutes} collapsed={collapsed} />
      </Stack>
    </Drawer>
  );
};
