import { Link, Stack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { MenuType } from '../../../../../pages/types';

export interface SecondaryMenuProps {
  secondaryMenuItems: MenuType[];
}

export const SecondaryMenu: React.FC<SecondaryMenuProps> = ({
  secondaryMenuItems,
}) => {
  const activeMenuColor = useColorModeValue('blue.900', 'blue.100');
  return (
    <Stack direction="row" spacing={6}>
      {secondaryMenuItems !== undefined && secondaryMenuItems.length > 0
        ? secondaryMenuItems.map((link, index) => (
            <Link
              key={index}
              _activeLink={{
                color: activeMenuColor,
                fontWeight: 'bold',
              }}
              as={RouterLink}
              to={link.path ?? ''}
            >
              {link.menuLabel}
            </Link>
          ))
        : null}
    </Stack>
  );
};
