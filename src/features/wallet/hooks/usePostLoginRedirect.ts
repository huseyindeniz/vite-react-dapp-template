import { useCallback, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePageLink } from '@/features/router/hooks/usePageLink';
import { usePages } from '@/features/router/hooks/usePages';

import { POST_LOGIN_REDIRECT_PATH } from '../config';

import { useWalletAuthentication } from './useWalletAuthentication';

export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useWalletAuthentication();
  const { pageLink } = usePageLink();
  const { homeRoute, userRoute, pageRoutes } = usePages();
  const prevAuthenticatedRef = useRef(isAuthenticated);
  const isMountedRef = useRef(true);

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
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
      isValidRoute(POST_LOGIN_REDIRECT_PATH)
    ) {
      // Check if component is still mounted before navigating
      if (!isMountedRef.current) {
        return;
      }

      // Use pageLink to get the proper i18n-aware path
      const redirectPath = pageLink(POST_LOGIN_REDIRECT_PATH);
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, pageLink, homeRoute, userRoute, pageRoutes]);
};
