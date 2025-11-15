import React from 'react';

import { Group, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';

import { MenuType } from '@/core/features/router/types/MenuType';

import classes from './MainMenu.module.css';

export interface MainMenuProps {
  onClick: () => void;
  mainMenuItems: MenuType[];
  vertical?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onClick,
  mainMenuItems,
  vertical = false,
}) => {
  const Container = vertical ? Stack : Group;

  return (
    <div className={classes.inner}>
      <Container gap={vertical ? 'xs' : 6}>
        {mainMenuItems?.length > 0
          ? mainMenuItems.map(link => (
              <NavLink
                key={link.menuLabel}
                to={link.path ?? ''}
                end={!link.subRoutes || link.subRoutes.length === 0}
                onClick={onClick}
                className={({ isActive }) =>
                  `${classes.link}${isActive ? ` ${classes.active}` : ''}`
                }
              >
                {link.menuLabel}
              </NavLink>
            ))
          : null}
      </Container>
    </div>
  );
};
