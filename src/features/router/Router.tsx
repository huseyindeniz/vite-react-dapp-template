import React, { JSX, useEffect } from 'react';

import {
  RouteObject,
  useRoutes as useReactRouterRoutes,
} from 'react-router-dom';

import { features } from '@/features/app/config/features';
import { HeaderExtension } from '@/features/app/config/layout-extensions/headerExtension';
import { NavbarExtension } from '@/features/app/config/layout-extensions/navbarExtension';
import { applyProtection } from '@/features/auth/utils/applyProtection';
import { i18nConfig } from '@/features/i18n/config';
import { useSliceManagerInit } from '@/features/slice-manager/hooks/useSliceManagerInit';

import { isHashRouter } from './config';
import { useRoutes } from './hooks/useRoutes';
import { PageType } from './types/PageType';

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
    default: (props: Record<string, never>) => (
      <module.LayoutBase
        {...props}
        headerExtension={HeaderExtension}
        navbarExtension={NavbarExtension}
      />
    ),
  }))
);

const NotFoundPage = React.lazy(() =>
  import(
    /* webpackChunkName: "NotFoundPage" */ '@/pages/NotFound/NotFound'
  ).then(module => ({ default: module.NotFoundPage }))
);

const Routes: React.FC = () => {
  // Note: Auth providers handle their own redirects internally

  // Initialize the slice manager
  const sliceManager = useSliceManagerInit();

  useEffect(() => {
    if (sliceManager) {
      // Configure slice manager for all features that need it
      Object.values(features).forEach(feature => {
        if ('configureSlice' in feature && typeof feature.configureSlice === 'function') {
          feature.configureSlice();
        }
      });
    }
  }, [sliceManager]);

  // Get all routes (system + user routes combined)
  const routes = useRoutes();
  const { homeRoute, pageRoutes, authRoutes } = routes;

  // Flatten routes - extract subRoutes and create flat list for React Router
  const flattenRoutes = (routes: PageType[]): PageType[] => {
    const flattened: PageType[] = [];

    routes.forEach(route => {
      // Add parent route
      flattened.push(route);

      // Extract and flatten subRoutes
      if (route.subRoutes && route.subRoutes.length > 0) {
        route.subRoutes.forEach(subRoute => {
          const childPageType = subRoute as PageType;
          flattened.push({
            ...childPageType,
            // Build full path by combining parent + child
            path: `${route.path}/${childPageType.path}`,
          });
        });
      }
    });

    return flattened;
  };

  const flatPageRoutes = flattenRoutes(pageRoutes);

  const protectedRoutes = flatPageRoutes.map(p => {
    const element = applyProtection(p.element as JSX.Element, p.protectionType);

    return {
      ...p,
      element,
    } as RouteObject;
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
        children: p.children.map((c: RouteObject) => {
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

  const routeRootWithLang: RouteObject = {
    path: `/:${i18nConfig.urlParam}`,
    children: [homeRoute, ...PagesWithLang, NotFound],
  };

  // Create routes with Layout wrapper
  const layoutRoutes: RouteObject = {
    path: '/',
    element: <Layout />,
    children: [homeRoute, ...protectedRoutes, routeRootWithLang],
  };

  // Create root route structure
  const routeRoot: RouteObject = {
    id: 'root',
    path: '/',
    children: [
      layoutRoutes,
      // Auth callback routes without layout (dynamically generated)
      ...authRoutes.map(route => ({
        path: route.path as string,
        element: route.element,
      })),
    ],
  };

  return useReactRouterRoutes([routeRoot]);
};

export const Router: React.FC = () => {
  return isHashRouter ? (
    <HashRouter>
      <Routes />
    </HashRouter>
  ) : (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes />
    </BrowserRouter>
  );
};
