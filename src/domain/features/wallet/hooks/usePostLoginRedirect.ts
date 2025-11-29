import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePageLink } from '@/core/features/router/hooks/usePageLink';
import { usePages } from '@/core/features/router/hooks/usePages';

import { POST_LOGIN_REDIRECT_PATH } from '../config';

import { useWalletAuthentication } from './useWalletAuthentication';

export const usePostLoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useWalletAuthentication();
  const { pageLink } = usePageLink();
  const { homeRoute, pageRoutes } = usePages();
  const prevAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    const prevAuthenticated = prevAuthenticatedRef.current;
    prevAuthenticatedRef.current = isAuthenticated;

    // Only redirect when transitioning from unauthenticated to authenticated
    // and POST_LOGIN_REDIRECT_PATH is explicitly set (not empty string)
    if (
      !prevAuthenticated &&
      isAuthenticated &&
      POST_LOGIN_REDIRECT_PATH &&
      POST_LOGIN_REDIRECT_PATH.trim() !== ''
    ) {
      const allRoutes = [homeRoute, ...pageRoutes];
      const isValidRoute = allRoutes.some(route => {
        if (route.index && POST_LOGIN_REDIRECT_PATH === '/') {
          return true;
        }
        return route.path === POST_LOGIN_REDIRECT_PATH?.replace(/^\//, '');
      });

      if (!isValidRoute) {
        return;
      }

      // Use pageLink to get the proper i18n-aware path
      const redirectPath = pageLink(POST_LOGIN_REDIRECT_PATH);
      navigate(redirectPath);
    }
  }, [isAuthenticated]);
};
