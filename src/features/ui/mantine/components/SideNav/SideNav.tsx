import React from 'react';

import { Stack, NavLink } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router-dom';

import { MenuType } from '@/features/router/types/MenuType';

import classes from './SideNav.module.css';

export interface SideNavProps {
  items: MenuType[];
}

export const SideNav: React.FC<SideNavProps> = ({ items }) => {
  const renderNavItem = (item: MenuType, index: number) => {
    if (item.subRoutes && item.subRoutes.length > 0) {
      return (
        <NavLink
          key={index}
          label={item.menuLabel}
          leftSection={item.icon}
          childrenOffset={28}
        >
          {item.subRoutes.map((child, childIndex) => renderNavItem(child, childIndex))}
        </NavLink>
      );
    }

    return (
      <NavLink
        key={index}
        component={RouterNavLink}
        to={item.path ?? ''}
        label={item.menuLabel}
        leftSection={item.icon}
      />
    );
  };

  return (
    <Stack gap="xs" className={classes.container}>
      {items.map((item, index) => renderNavItem(item, index))}
    </Stack>
  );
};
