import React from 'react';

import { useTranslation } from 'react-i18next';

import { AppRoutes, PageType } from '@/features/router/types';

const HomePage = React.lazy(() =>
  import(/* webpackChunkName: "HomePage" */ './Home/Home').then(module => ({
    default: module.HomePage,
  }))
);

const UserPage = React.lazy(() =>
  import(/* webpackChunkName: "UserPage" */ './User/User').then(module => ({
    default: module.UserPage,
  }))
);

// ADD YOUR PAGE IMPORTS HERE

const Page1 = React.lazy(() =>
  import(/* webpackChunkName: "Page1Page" */ './Page1/Page1').then(module => ({
    default: module.Page1,
  }))
);

const Page2 = React.lazy(() =>
  import(/* webpackChunkName: "Page2Page" */ './Page2/Page2').then(module => ({
    default: module.Page2,
  }))
);

export const routes = () => {
  const { t } = useTranslation('Menu');

  // if you do not have control/access on hosting(html server) config, use hashRouter
  // keep in mind that if you do not use hashRouter,
  // you should redirect all requests to index.html in your server config

  // ADD YOUR PAGE ROUTES HERE

  // Page1 Route
  const Page1Route: PageType = {
    path: 'page1',
    element: <Page1 />,
    menuLabel: t('Page 1', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    isProtected: false,
  };

  // Page2 Route
  const Page2Route: PageType = {
    path: 'page2',
    element: <Page2 />,
    menuLabel: t('Page 2', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: false,
    isProtected: true,
  };

  // do not forget add your page routes into this array
  const PageRoutes: PageType[] = [Page1Route, Page2Route];

  // Special Routes
  const HomeRoute: PageType = {
    index: true,
    element: <HomePage />,
    menuLabel: t('Home', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    isProtected: false,
  };

  // User Dashboard Page
  const UserRoute: PageType = {
    path: 'user',
    element: <UserPage />,
    menuLabel: t('Dashboard', { ns: 'Menu' }),
    isProtected: true,
  };

  return {
    homeRoute: HomeRoute,
    userRoute: UserRoute,
    pageRoutes: PageRoutes,
  } as AppRoutes;
};
