import React from 'react';

import { useTranslation } from 'react-i18next';

import { ProtectionType } from '@/features/app/config/auth/ProtectionType';
import { getUserPageRoutes } from '@/features/app/config/routes';
import { getAuthRoutes } from '@/features/auth/utils/getAuthRoutes';

import { AppRoutes } from '../types/AppRoutes';
import { PageType } from '../types/PageType';

// System Pages - DO NOT MODIFY
const HomePage = React.lazy(() =>
  import(/* webpackChunkName: "HomePage" */ '@/pages/Home/Home').then(
    module => ({
      default: module.HomePage,
    })
  )
);

const UserPage = React.lazy(() =>
  import(/* webpackChunkName: "UserPage" */ '@/pages/User/User').then(
    module => ({
      default: module.UserPage,
    })
  )
);

/**
 * Main routes hook - combines system and user routes
 * System routes (Home, User, Auth callbacks) are defined here
 * User routes are imported from @/pages/routes.tsx
 */
export const useRoutes = (): AppRoutes => {
  const { t } = useTranslation('menu');

  // System Routes - Home Page
  const homeRoute: PageType = {
    index: true,
    element: <HomePage />,
    menuLabel: t('Home', { ns: 'menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // System Routes - User Dashboard
  const userRoute: PageType = {
    path: 'user',
    element: <UserPage />,
    menuLabel: t('Dashboard', { ns: 'menu' }),
    protectionType: ProtectionType.WALLET,
  };

  // Get user page routes with translation function
  const userPageRoutes = getUserPageRoutes(t);
  const authRoutes = getAuthRoutes() as PageType[];
  return {
    homeRoute,
    userRoute,
    pageRoutes: userPageRoutes,
    authRoutes,
  };
};
