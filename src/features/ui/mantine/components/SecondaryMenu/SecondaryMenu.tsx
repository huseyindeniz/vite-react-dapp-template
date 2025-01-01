import React from 'react';

import { Group, Anchor } from '@mantine/core';
import { NavLink as RouterLink } from 'react-router-dom';

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
              <Anchor
                key={index}
                component={RouterLink}
                to={link.path ?? ''}
                className={classes.link}
              >
                {link.menuLabel}
              </Anchor>
            ))
          : null}
      </Group>
    </div>
  );
};
