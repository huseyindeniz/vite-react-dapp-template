import { ReactNode } from 'react';

import { RouteObject } from 'react-router-dom';

import { ProtectionType } from '@/config/auth/ProtectionType';

export type MenuType = {
  path?: string;
  menuLabel: string | null;
  isShownInMainMenu?: boolean;
  isShownInSecondaryMenu?: boolean;
  protectionType?: ProtectionType;
  fullWidth?: boolean;
  icon?: ReactNode;
  subRoutes?: (MenuType & RouteObject)[];
};
