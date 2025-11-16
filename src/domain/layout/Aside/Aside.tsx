import React from 'react';

import { ActionIcon, Drawer, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { useActiveRoute } from '@/core/features/router/hooks/useActiveRoute';
import { usePages } from '@/core/features/router/hooks/usePages';

import { SideNav } from '../SideNav/SideNav';

export const Aside: React.FC = () => {
  const { pageRoutes } = usePages();
  const { subRouteHasMenuItems, subMenu } = useActiveRoute(pageRoutes);
  const [collapsed, { toggle }] = useDisclosure(false); // Default: expanded
  const isMobile = useMediaQuery('(max-width: 87.5em)'); // xl breakpoint

  if (!subRouteHasMenuItems) {
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
        <SideNav items={subMenu} collapsed={collapsed} />
      </Stack>
    </Drawer>
  );
};
