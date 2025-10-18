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

const Page1 = React.lazy(() =>
  import(/* webpackChunkName: "Page1Page" */ './Page1/Page1').then(module => ({
    default: module.Page1,
  }))
);

const Page2 = React.lazy(() =>
  import(/* webpackChunkName: "Page2Page" */ './Page2/Page2').then(module => ({
    default: module.Page2,
  }))
);

const AuthPage1 = React.lazy(() =>
  import(/* webpackChunkName: "AuthPage1Page" */ './AuthPage1/AuthPage1').then(
    module => ({
      default: module.AuthPage1,
    })
  )
);

const AuthPage2 = React.lazy(() =>
  import(/* webpackChunkName: "AuthPage2Page" */ './AuthPage2/AuthPage2').then(
    module => ({
      default: module.AuthPage2,
    })
  )
);

const AuthAndWalletPage = React.lazy(() =>
  import(
    /* webpackChunkName: "AuthAndWalletPage" */ './AuthAndWallet/AuthAndWalletPage'
  ).then(module => ({
    default: module.AuthAndWalletPage,
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

  // Page1 Route
  const Page1Route: PageType = {
    path: 'page1',
    element: <Page1 />,
    menuLabel: t('Page 1', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // Page2 Route
  const Page2Route: PageType = {
    path: 'page2',
    element: <Page2 />,
    menuLabel: t('Page 2', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.WALLET,
  };

  // AuthPage1 Route
  const AuthPage1Route: PageType = {
    path: 'authpage1',
    element: <AuthPage1 />,
    menuLabel: t('Auth Page 1', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // AuthPage2 Route
  const AuthPage2Route: PageType = {
    path: 'authpage2',
    element: <AuthPage2 />,
    menuLabel: t('Auth Page 2', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.AUTH,
  };

  const AuthAndWalletRoute: PageType = {
    path: 'authandwallet',
    element: <AuthAndWalletPage />,
    menuLabel: t('Auth and Wallet Page', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.BOTH,
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
    Page1Route,
    Page2Route,
    AuthPage1Route,
    AuthPage2Route,
    AuthAndWalletRoute,
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
