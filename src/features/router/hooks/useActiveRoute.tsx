import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { i18nConfig } from '@/features/i18n/config';

import { MenuType } from '../types/MenuType';

interface ActiveRouteInfo {
  currentRoute?: MenuType;
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
  fullWidth: boolean;
}

export const useActiveRoute = (allRoutes: MenuType[]): ActiveRouteInfo => {
  const location = useLocation();
  const { i18n } = useTranslation();

  return useMemo(() => {
    // Remove language prefix from pathname for matching
    let pathname = location.pathname;

    // Check if path starts with a supported language code
    const currentLang = i18n.resolvedLanguage;
    if (currentLang && currentLang !== i18nConfig.fallbackLang.code) {
      // Remove /:lang/ prefix if present
      const langPrefix = `/${currentLang}/`;
      if (pathname.startsWith(langPrefix)) {
        pathname = pathname.substring(langPrefix.length - 1); // Keep leading slash
      }
    }

    // Remove trailing slash
    pathname = pathname.replace(/\/$/, '') || '/';

    // Find route that matches current path
    let matchedRoute: MenuType | undefined;

    for (const route of allRoutes) {
      const routePath = route.path?.replace(/\/$/, '') || '/';

      // Exact match - could be a route with or without subRoutes
      if (pathname === `/${routePath}`) {
        matchedRoute = route;
        break;
      }

      // Path starts with this route - check if it's a parent with subRoutes
      if (pathname.startsWith(`/${routePath}/`)) {
        if (route.subRoutes && route.subRoutes.length > 0) {
          matchedRoute = route;
          break;
        }
      }
    }

    const hasSubRoutes = !!(
      matchedRoute?.subRoutes && matchedRoute.subRoutes.length > 0
    );

    // Build full paths for subRoutes including language prefix
    const subRoutes =
      matchedRoute?.subRoutes?.map(subRoute => {
        const fullPath = matchedRoute.path
          ? `${matchedRoute.path}/${subRoute.path}`
          : subRoute.path;
        const pathWithLang =
          currentLang === i18nConfig.fallbackLang.code
            ? fullPath
            : `/${currentLang}/${fullPath}`;

        return {
          ...subRoute,
          path: pathWithLang,
        };
      }) || [];

    const fullWidth = matchedRoute?.fullWidth || false;

    return {
      currentRoute: matchedRoute,
      hasSubRoutes,
      subRoutes,
      fullWidth,
    };
  }, [location.pathname, i18n.resolvedLanguage]);
};
