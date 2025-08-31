import { useCallback, useEffect, useRef } from 'react';

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

  const isValidRoute = useCallback(
    (path: string) => {
      const allRoutes = [homeRoute, userRoute, ...pageRoutes];
      return allRoutes.some(route => {
        if (route.index && path === '/') {
          return true;
        }
        return route.path === path?.replace(/^\//, '');
      });
    },
    [homeRoute, userRoute, pageRoutes]
  );

  useEffect(() => {
    const prevAuthenticated = prevAuthenticatedRef.current;
    prevAuthenticatedRef.current = isAuthenticated;

    // Only redirect when transitioning from unauthenticated to authenticated
    // and POST_LOGIN_REDIRECT_PATH is explicitly set (not empty string)
    if (
      !prevAuthenticated &&
      isAuthenticated &&
      POST_LOGIN_REDIRECT_PATH &&
      POST_LOGIN_REDIRECT_PATH.trim() !== '' &&
      !POST_LOGIN_REDIRECT_PATH.startsWith('http')
    ) {
      // Check if redirect path is a valid route
      if (isValidRoute(POST_LOGIN_REDIRECT_PATH)) {
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
