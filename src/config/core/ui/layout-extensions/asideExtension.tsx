import React from 'react';

import { MenuType } from '@/core/features/router/types/MenuType';
import { Aside } from '@/domain/layout/Aside/Aside';

interface AsideExtensionProps {
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
}

export const AsideExtension: React.FC<AsideExtensionProps> = ({
  hasSubRoutes,
  subRoutes,
}) => {
  return <Aside hasSubRoutes={hasSubRoutes} subRoutes={subRoutes} />;
};
