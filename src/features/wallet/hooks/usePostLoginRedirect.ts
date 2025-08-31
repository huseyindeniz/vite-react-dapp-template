import { useEffect, useRef } from 'react';

import log from 'loglevel';
import { useNavigate } from 'react-router-dom';

import { usePageLink } from '@/features/router/usePageLink';
import { usePages } from '@/features/router/usePages';

import { POST_LOGIN_REDIRECT_PATH } from '../config';

import { useWalletAuthentication } from './useWalletAuthentication';

export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useWalletAuthentication();
  const { pageLink } = usePageLink();
  const { homeRoute, userRoute, pageRoutes } = usePages();
  const prevAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    const prevAuthenticated = prevAuthenticatedRef.current;
    prevAuthenticatedRef.current = isAuthenticated;

    // Only redirect when transitioning from unauthenticated to authenticated
    // and POST_LOGIN_REDIRECT_PATH is explicitly set (not empty string)
    if (!prevAuthenticated && isAuthenticated && POST_LOGIN_REDIRECT_PATH && POST_LOGIN_REDIRECT_PATH.trim() !== '') {
      // Check if redirect path is a valid route
      const allRoutes = [homeRoute, userRoute, ...pageRoutes];
      const isValidRoute = allRoutes.some(route => {
        // For home route, match '/' only
        if (route.index && POST_LOGIN_REDIRECT_PATH === '/') {
          return true;
        }
        // For other routes, match the path exactly
        return route.path === POST_LOGIN_REDIRECT_PATH?.replace(/^\//, '');
      });

      if (isValidRoute) {
        // Use pageLink to get the proper i18n-aware path
        const redirectPath = pageLink(POST_LOGIN_REDIRECT_PATH);
        navigate(redirectPath);
      } else {
        log.warn(
          `POST_LOGIN_REDIRECT_PATH "${POST_LOGIN_REDIRECT_PATH}" is not a valid route. Available routes:`,
          [
            '/',
            ...pageRoutes.map(r => `/${r.path}`),
            `/${userRoute.path}`,
          ].join(', ')
        );
      }
    }
  }, [isAuthenticated, navigate, pageLink, homeRoute, userRoute, pageRoutes]);
};
