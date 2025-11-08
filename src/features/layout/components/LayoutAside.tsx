import React from 'react';

import { Drawer } from '@mantine/core';

export const LayoutAside = ({
  children,
  opened,
  size,
}: {
  children: React.ReactNode;
  opened: boolean;
  size: string | number;
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={() => {}} // No-op, controlled externally
      position="right"
      size={size}
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
      {children}
    </Drawer>
  );
};
