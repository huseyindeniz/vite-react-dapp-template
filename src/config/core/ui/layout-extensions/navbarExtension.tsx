import React from 'react';

import { MenuType } from '@/core/features/router/types/MenuType';
import { Navbar } from '@/domain/layout/Navbar/Navbar';

interface NavbarExtensionProps {
  mainMenuItems: MenuType[];
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
  close: () => void;
}

export const NavbarExtension: React.FC<NavbarExtensionProps> = ({
  mainMenuItems,
  hasSubRoutes,
  subRoutes,
  close,
}) => {
  return (
    <Navbar
      mainMenuItems={mainMenuItems}
      hasSubRoutes={hasSubRoutes}
      subRoutes={subRoutes}
      close={close}
    />
  );
};
