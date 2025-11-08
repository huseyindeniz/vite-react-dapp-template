import React from 'react';

import { MenuType } from '@/features/router/types/MenuType';
import { Aside } from '@/features/site/components/Aside/Aside';

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
