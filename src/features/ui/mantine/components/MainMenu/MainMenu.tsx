import React from 'react';

import { Group, Anchor } from '@mantine/core';
import { NavLink as RouterLink } from 'react-router-dom';

import { MenuType } from '@/features/router/types';

import classes from './MainMenu.module.css';

export interface MainMenuProps {
  onClick: () => void;
  mainMenuItems: MenuType[];
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onClick,
  mainMenuItems,
}) => {
  return (
    <div className={classes.inner}>
      <Group gap={6}>
        {mainMenuItems?.length > 0
          ? mainMenuItems.map((link, index) => (
              <Anchor
                key={index}
                component={RouterLink}
                to={link.path ?? ''}
                onClick={onClick}
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
