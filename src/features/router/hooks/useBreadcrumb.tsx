import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { i18nConfig } from '@/features/i18n/config';
import { BreadcrumbItem } from '@/features/ui/mantine/components/Breadcrumb/Breadcrumb';

import { MenuType } from '../types/MenuType';

export const useBreadcrumb = (allRoutes: MenuType[]): BreadcrumbItem[] => {
  const location = useLocation();
  const { i18n, t } = useTranslation('Layout');

  return useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // Always start with Home
    const currentLang = i18n.resolvedLanguage;
    const homeHref = currentLang === i18nConfig.fallbackLang.code ? '/' : `/${currentLang}/`;
    items.push({
      title: t('Home'),
      href: homeHref,
    });

    // Remove language prefix from pathname for matching
    let pathname = location.pathname;
    if (currentLang && currentLang !== i18nConfig.fallbackLang.code) {
      const langPrefix = `/${currentLang}/`;
      if (pathname.startsWith(langPrefix)) {
        pathname = pathname.substring(langPrefix.length - 1);
      }
    }

    // Remove trailing slash
    pathname = pathname.replace(/\/$/, '') || '/';

    // If we're on home, return just home
    if (pathname === '/') {
      return items;
    }

    // Find matching routes
    let parentRoute: MenuType | undefined;
    let currentRoute: MenuType | undefined;

    // First, try to find parent route
    for (const route of allRoutes) {
      const routePath = route.path?.replace(/\/$/, '') || '/';

      // Skip dynamic routes (containing :)
      if (route.path?.includes(':')) {
        continue;
      }

      if (pathname === `/${routePath}`) {
        // Exact match - this is the current route
        currentRoute = route;
        break;
      } else if (pathname.startsWith(`/${routePath}/`)) {
        // We're inside this route's children
        if (route.subRoutes && route.subRoutes.length > 0) {
          parentRoute = route;

          // Find the exact child route (skip dynamic routes)
          for (const subRoute of route.subRoutes) {
            // Skip dynamic child routes (containing :)
            if (subRoute.path?.includes(':')) {
              continue;
            }

            const subPath = `${routePath}/${subRoute.path}`;
            if (pathname === `/${subPath}`) {
              currentRoute = subRoute;
              break;
            }
          }

          // If no static child route matched but we have a parent,
          // it might be a dynamic route - just show the parent
          if (!currentRoute) {
            break;
          }
          break;
        }
      }
    }

    // If no route found, check if pathname matches any dynamic route pattern
    if (!currentRoute && !parentRoute) {
      for (const route of allRoutes) {
        if (route.path?.includes(':')) {
          // Convert route pattern to regex
          // Example: blog/:postId -> ^/blog/[^/]+$
          const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
          const regex = new RegExp(`^/${pattern}$`);

          if (regex.test(pathname)) {
            // Match found! Find the static prefix
            const staticPrefix = route.path.split(':')[0].replace(/\/$/, '');

            // Find parent route with this prefix
            const foundParentRoute = allRoutes.find(r => r.path === staticPrefix);
            if (foundParentRoute) {
              parentRoute = foundParentRoute;
            }
            break;
          }
        }
      }
    }

    // Build breadcrumb items
    if (parentRoute) {
      const parentPath = parentRoute.path?.replace(/\/$/, '');
      const parentHref = currentLang === i18nConfig.fallbackLang.code
        ? `/${parentPath}`
        : `/${currentLang}/${parentPath}`;

      items.push({
        title: parentRoute.menuLabel || '',
        href: parentHref,
      });
    }

    if (currentRoute) {
      let currentHref = '';
      if (parentRoute) {
        const parentPath = parentRoute.path?.replace(/\/$/, '');
        const currentPath = currentRoute.path?.replace(/\/$/, '');
        currentHref = currentLang === i18nConfig.fallbackLang.code
          ? `/${parentPath}/${currentPath}`
          : `/${currentLang}/${parentPath}/${currentPath}`;
      } else {
        const currentPath = currentRoute.path?.replace(/\/$/, '');
        currentHref = currentLang === i18nConfig.fallbackLang.code
          ? `/${currentPath}`
          : `/${currentLang}/${currentPath}`;
      }

      items.push({
        title: currentRoute.menuLabel || '',
        href: currentHref,
      });
    }

    return items;
  }, [location.pathname, i18n.resolvedLanguage]);
};
