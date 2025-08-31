import React from 'react';

import { Group } from '@mantine/core';
import { NavLink } from 'react-router-dom';

import { MenuType } from '@/features/router/types';

import classes from './SecondaryMenu.module.css';

export interface SecondaryMenuProps {
  secondaryMenuItems: MenuType[];
}

export const SecondaryMenu: React.FC<SecondaryMenuProps> = ({
  secondaryMenuItems,
}) => {
  return (
    <div className={classes.inner}>
      <Group gap={6}>
        {secondaryMenuItems?.length > 0
          ? secondaryMenuItems.map((link, index) => (
              <NavLink
                key={index}
                to={link.path ?? ''}
                end
                className={({ isActive }) =>
                  `${classes.link}${isActive ? ` ${classes.active}` : ''}`
                }
              >
                {link.menuLabel}
              </NavLink>
            ))
          : null}
      </Group>
    </div>
  );
};
