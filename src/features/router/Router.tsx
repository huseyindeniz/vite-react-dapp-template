import React, { JSX } from 'react';

import { RouteObject, useRoutes } from 'react-router-dom';

import { i18nConfig } from '@/features/i18n/config';

import { withWalletProtection } from '../wallet/hocs/withWalletProtection';

import { isHashRouter } from './config';
import { AppRoutes } from './types';

const HashRouter = React.lazy(() =>
  import(/* webpackChunkName: "Router" */ 'react-router-dom').then(module => ({
    default: module.HashRouter,
  }))
);

const BrowserRouter = React.lazy(() =>
  import(/* webpackChunkName: "BrowserRouter" */ 'react-router-dom').then(
    module => ({
      default: module.BrowserRouter,
    })
  )
);

const Layout = React.lazy(() =>
  import(
    /* webpackChunkName: "Layout" */ '@/features/ui/mantine/Layout/LayoutBase'
  ).then(module => ({
    default: module.LayoutBase,
  }))
);

const NotFoundPage = React.lazy(() =>
  import(
    /* webpackChunkName: "NotFoundPage" */ '../../pages/NotFound/NotFound'
  ).then(module => ({ default: module.NotFoundPage }))
);

export interface RoutesProps {
  routes: AppRoutes;
}

const Routes: React.FC<RoutesProps> = ({ routes }) => {
  const { homeRoute, userRoute, pageRoutes } = routes;

  const protectedRoutes = pageRoutes.map(p => {
    return {
      ...p,
      element: p.isProtected
        ? withWalletProtection(p.element as JSX.Element)
        : p.element,
    };
  });

  const NotFound: RouteObject = {
    path: '*',
    element: <NotFoundPage />,
  };

  const PagesWithLang = protectedRoutes.map(p => {
    if (p.children) {
      return {
        ...p,
        path: `/:${i18nConfig.urlParam}/${p.path}`,
        children: p.children.map(c => {
          if (c.index) {
            return c;
          }
          return {
            ...c,
            path: `/:${i18nConfig.urlParam}${c.path}`,
          };
        }),
      };
    }
    return {
      ...p,
      path: `/:${i18nConfig.urlParam}/${p.path}`,
    };
  });

  const UserWithLang = {
    ...userRoute,
    path: `/:${i18nConfig.urlParam}/${userRoute.path}`,
  };

  const routeRootWithLang: RouteObject = {
    path: `/:${i18nConfig.urlParam}`,
    children: [homeRoute, UserWithLang, ...PagesWithLang, NotFound],
  };

  const routeRoot: RouteObject = {
    id: 'root',
    path: '/',
    element: <Layout />,
    children: [homeRoute, userRoute, ...protectedRoutes, routeRootWithLang],
  };
  return useRoutes([routeRoot]);
};

export interface RouterProps {
  routes: AppRoutes;
}

export const Router: React.FC<RouterProps> = ({ routes }) => {
  return isHashRouter ? (
    <HashRouter>
      <Routes routes={routes} />
    </HashRouter>
  ) : (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes routes={routes} />
    </BrowserRouter>
  );
};
