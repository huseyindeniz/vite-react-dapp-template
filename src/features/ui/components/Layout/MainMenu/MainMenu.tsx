import { Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { MenuType } from '../../../../../pages/types';

export interface MainMenuProps {
  onClick: () => void;
  mainMenuItems: MenuType[];
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onClick,
  mainMenuItems,
}) => {
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const activeMenuColor = useColorModeValue('blue.900', 'blue.100');
  return (
    <>
      {mainMenuItems !== undefined && mainMenuItems.length > 0
        ? mainMenuItems.map((link, index) => (
            <Link
              key={index}
              as={RouterLink}
              to={link.path ?? ''}
              px={2}
              py={1}
              rounded="md"
              _hover={{
                textDecoration: 'none',
                bg: bgColor,
              }}
              _activeLink={{
                color: activeMenuColor,
                fontWeight: 'bold',
              }}
              onClick={onClick}
            >
              {link.menuLabel}
            </Link>
          ))
        : null}
    </>
  );
};
