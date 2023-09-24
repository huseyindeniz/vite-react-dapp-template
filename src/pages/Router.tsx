import React from 'react';

import { RouteObject, useRoutes } from 'react-router-dom';

import { i18nConfig } from '@/features/i18n/config';

import { usePages } from './usePages';

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
    /* webpackChunkName: "Layout" */ '@/features/ui/components/Layout/Layout'
  ).then(module => ({
    default: module.Layout,
  }))
);

const NotFoundPage = React.lazy(() =>
  import(/* webpackChunkName: "NotFoundPage" */ './NotFound/NotFound').then(
    module => ({ default: module.NotFoundPage })
  )
);

const Routes: React.FC = () => {
  const { Home, User, Pages } = usePages();

  const NotFound: RouteObject = {
    path: '*',
    element: <NotFoundPage />,
  };

  const PagesWithLang = Pages.map(p => {
    if (p.children) {
      return {
        ...p,
        path: `/:${i18nConfig.urlParam}/${p.path}`,
        children: p.children.map(c => {
          if (c.index) {
            return c;
          } else {
            return {
              ...c,
              path: `/:${i18nConfig.urlParam}${c.path}`,
            };
          }
        }),
      };
    } else {
      return {
        ...p,
        path: `/:${i18nConfig.urlParam}/${p.path}`,
      };
    }
  });

  const UserWithLang = {
    ...User,
    path: `/:${i18nConfig.urlParam}/${User.path}`,
  };

  const routeRootWithLang: RouteObject = {
    path: `/:${i18nConfig.urlParam}`,
    children: [Home, UserWithLang, ...PagesWithLang, NotFound],
  };

  const routeRoot: RouteObject = {
    id: 'root',
    path: '/',
    element: <Layout />,
    children: [Home, User, ...Pages, routeRootWithLang],
  };
  return useRoutes([routeRoot]);
};

export const Router: React.FC = () => {
  const { isHashRouter } = usePages();
  return isHashRouter ? (
    <HashRouter>
      <Routes />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};
