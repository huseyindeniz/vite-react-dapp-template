import React from 'react';

import { PageType } from '@/features/router/types/PageType';
import { ProtectionType } from '@/features/router/types/ProtectionType';

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

export const getAuthRoutes = (): PageType[] => {
  // GithubCallbackPage Route
  const GithubCallbackRoute: PageType = {
    id: `github-callback`,
    path: `auth/callback/github`,
    element: <GithubCallbackPage />,
    menuLabel: `Github Callback`,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.NONE,
  };

  // GoogleCallbackPage Route
  const GoogleCallbackRoute: PageType = {
    id: `github-callback`,
    path: `auth/callback/google`,
    element: <GoogleCallbackPage />,
    menuLabel: `Google Callback`,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.NONE,
  };

  return [GithubCallbackRoute, GoogleCallbackRoute];
};
