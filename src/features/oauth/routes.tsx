import React from 'react';

import { ProtectionType } from '@/features/app/config/auth/ProtectionType';
import { PageType } from '@/features/router/types/PageType';

const GithubCallbackPage = React.lazy(() =>
  import(/* webpackChunkName: "AiChatPage" */ './pages/GithubCallback').then(
    module => ({
      default: module.GithubCallback,
    })
  )
);

const GoogleCallbackPage = React.lazy(() =>
  import(/* webpackChunkName: "AiChatPage" */ './pages/GoogleCallback').then(
    module => ({
      default: module.GoogleCallback,
    })
  )
);

export const getOAuthRoutes = (): PageType[] => {
  // GithubCallbackPage Route
  const GithubCallbackRoute: PageType = {
    id: `github-callback`,
    path: `oauth/callback/github`,
    element: <GithubCallbackPage />,
    menuLabel: `Github Callback`,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.NONE,
  };

  // GoogleCallbackPage Route
  const GoogleCallbackRoute: PageType = {
    id: `github-callback`,
    path: `oauth/callback/google`,
    element: <GoogleCallbackPage />,
    menuLabel: `Google Callback`,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.NONE,
  };

  return [GithubCallbackRoute, GoogleCallbackRoute];
};
