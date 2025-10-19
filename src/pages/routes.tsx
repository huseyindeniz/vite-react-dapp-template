import React from 'react';

import { useTranslation } from 'react-i18next';

import { SUPPORTED_AUTH_PROVIDERS } from '@/features/auth/config';
import { AppRoutes } from '@/features/router/types/AppRoutes';
import { PageType } from '@/features/router/types/PageType';
import { ProtectionType } from '@/features/router/types/ProtectionType';

const HomePage = React.lazy(() =>
  import(/* webpackChunkName: "HomePage" */ './Home/Home').then(module => ({
    default: module.HomePage,
  }))
);

const UserPage = React.lazy(() =>
  import(/* webpackChunkName: "UserPage" */ './User/User').then(module => ({
    default: module.UserPage,
  }))
);

// Dynamically create auth callback pages based on supported providers
const AuthCallbackPages = SUPPORTED_AUTH_PROVIDERS.reduce(
  (pages, provider) => {
    const providerName = provider.name;
    // Capitalize first letter of provider name for component naming
    const componentName = `${providerName.charAt(0).toUpperCase()}${providerName.slice(1)}Callback`;

    pages[providerName] = React.lazy(() =>
      import(
        /* webpackChunkName: "[request]CallbackPage" */ `./auth/${componentName}.tsx`
      ).then(module => ({
        default: module[componentName],
      }))
    );

    return pages;
  },
  {} as Record<string, React.LazyExoticComponent<React.ComponentType>>
);

// ADD YOUR PAGE IMPORTS HERE

// Auth Demo Parent Page
const AuthDemo = React.lazy(() =>
  import(/* webpackChunkName: "AuthDemoPage" */ './AuthDemo/AuthDemo').then(
    module => ({
      default: module.AuthDemo,
    })
  )
);

// Auth Demo Sub-pages
const WalletBasic = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletBasicPage" */ './AuthDemo/WalletBasic/WalletBasic'
  ).then(module => ({
    default: module.WalletBasic,
  }))
);

const WalletProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletProtectedPage" */ './AuthDemo/WalletProtected/WalletProtected'
  ).then(module => ({
    default: module.WalletProtected,
  }))
);

const OAuthDemo = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthDemoPage" */ './AuthDemo/OAuthDemo/OAuthDemo'
  ).then(module => ({
    default: module.OAuthDemo,
  }))
);

const OAuthProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthProtectedPage" */ './AuthDemo/OAuthProtected/OAuthProtected'
  ).then(module => ({
    default: module.OAuthProtected,
  }))
);

const CombinedAuth = React.lazy(() =>
  import(
    /* webpackChunkName: "CombinedAuthPage" */ './AuthDemo/CombinedAuth/CombinedAuth'
  ).then(module => ({
    default: module.CombinedAuth,
  }))
);

const BlogPage = React.lazy(() =>
  import(/* webpackChunkName: "BlogPage" */ './Blog/Blog').then(module => ({
    default: module.Blog,
  }))
);

const BlogPostPage = React.lazy(() =>
  import(/* webpackChunkName: "BlogPostPage" */ './Blog/BlogPost').then(
    module => ({
      default: module.BlogPost,
    })
  )
);

export const routes = () => {
  const { t } = useTranslation('Menu');

  // if you do not have control/access on hosting(html server) config, use hashRouter
  // keep in mind that if you do not use hashRouter,
  // you should redirect all requests to index.html in your server config

  // ADD YOUR PAGE ROUTES HERE

  // Auth Demo Parent Route with sub-routes
  const AuthDemoRoute: PageType = {
    id: 'auth-demo',
    path: 'auth-demo',
    element: <AuthDemo />,
    menuLabel: t('Auth Demo', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
    subRoutes: [
      {
        path: 'wallet-basic',
        element: <WalletBasic />,
        menuLabel: t('Wallet - Basic', { ns: 'Menu' }),
        protectionType: ProtectionType.NONE,
      },
      {
        path: 'wallet-protected',
        element: <WalletProtected />,
        menuLabel: t('Wallet - Protected', { ns: 'Menu' }),
        protectionType: ProtectionType.WALLET,
      },
      {
        path: 'oauth',
        element: <OAuthDemo />,
        menuLabel: t('OAuth - Basic', { ns: 'Menu' }),
        protectionType: ProtectionType.NONE,
      },
      {
        path: 'oauth-protected',
        element: <OAuthProtected />,
        menuLabel: t('OAuth - Protected', { ns: 'Menu' }),
        protectionType: ProtectionType.AUTH,
      },
      {
        path: 'combined',
        element: <CombinedAuth />,
        menuLabel: t('Combined Auth', { ns: 'Menu' }),
        protectionType: ProtectionType.BOTH,
      },
    ],
  };

  // Blog Route
  const BlogHome: PageType = {
    id: 'blog-home',
    path: 'blog',
    element: <BlogPage />,
    menuLabel: t('Blog', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // Blog Post Route
  const BlogPostRoute: PageType = {
    id: 'blog-post',
    path: 'blog/:postId',
    element: <BlogPostPage />,
    menuLabel: t('Post', { ns: 'Menu' }),
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.NONE,
  };

  // do not forget add your page routes into this array
  const PageRoutes: PageType[] = [
    AuthDemoRoute,
    BlogHome,
    BlogPostRoute,
  ];

  // Special Routes
  const HomeRoute: PageType = {
    index: true,
    element: <HomePage />,
    menuLabel: t('Home', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // User Dashboard Page
  const UserRoute: PageType = {
    path: 'user',
    element: <UserPage />,
    menuLabel: t('Dashboard', { ns: 'Menu' }),
    protectionType: ProtectionType.WALLET,
  };

  // Dynamically create auth callback routes based on supported providers
  const authRoutes: PageType[] = SUPPORTED_AUTH_PROVIDERS.map(provider => {
    const providerName = provider.name;
    const CallbackComponent = AuthCallbackPages[providerName];

    return {
      id: `${providerName}-callback`,
      path: `auth/callback/${providerName}`,
      element: <CallbackComponent />,
      menuLabel: `${provider.label} Callback`,
      isShownInMainMenu: false,
      isShownInSecondaryMenu: false,
      protectionType: ProtectionType.NONE,
    };
  });

  return {
    homeRoute: HomeRoute,
    userRoute: UserRoute,
    pageRoutes: PageRoutes,
    authRoutes,
  } as AppRoutes;
};
