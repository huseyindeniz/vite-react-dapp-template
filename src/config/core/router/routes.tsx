import React from 'react';

import { TFunction } from 'i18next';
import {
  IoWallet,
  IoWalletOutline,
  IoLogIn,
  IoShieldCheckmark,
  IoShield,
} from 'react-icons/io5';

import { ProtectionType } from '@/config/core/auth/ProtectionType';
import { PageType } from '@/core/features/router/types/PageType';

// =============================================================================
// USER PAGE IMPORTS - Add your page imports below
// =============================================================================

const DemoAIAssistantPage = React.lazy(() =>
  import(
    /* webpackChunkName: "DemoAIAssistantPage" */ '@/pages/DemoAIAssistant/DemoAIAssistant'
  ).then(module => ({
    default: module.DemoAIAssistantPage,
  }))
);

// Demo Auth Parent Page
const DemoAuth = React.lazy(() =>
  import(
    /* webpackChunkName: "DemoAuthPage" */ '@/pages/DemoAuth/DemoAuth'
  ).then(module => ({
    default: module.DemoAuthPage,
  }))
);

// Demo Auth Sub-pages
const WalletBasic = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletBasicPage" */ '@/pages/DemoAuth/WalletBasic/WalletBasic'
  ).then(module => ({
    default: module.WalletBasicPage,
  }))
);

const WalletProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletProtectedPage" */ '@/pages/DemoAuth/WalletProtected/WalletProtected'
  ).then(module => ({
    default: module.WalletProtectedPage,
  }))
);

const OAuthDemo = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthDemoPage" */ '@/pages/DemoAuth/OAuthDemo/OAuthDemo'
  ).then(module => ({
    default: module.OAuthDemoPage,
  }))
);

const OAuthProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthProtectedPage" */ '@/pages/DemoAuth/OAuthProtected/OAuthProtected'
  ).then(module => ({
    default: module.OAuthProtectedPage,
  }))
);

const CombinedAuth = React.lazy(() =>
  import(
    /* webpackChunkName: "CombinedAuthPage" */ '@/pages/DemoAuth/CombinedAuth/CombinedAuth'
  ).then(module => ({
    default: module.CombinedAuthPage,
  }))
);

const DemoBlogPage = React.lazy(() =>
  import(
    /* webpackChunkName: "DemoBlogPage" */ '@/pages/DemoBlog/DemoBlog'
  ).then(module => ({
    default: module.DemoBlogPage,
  }))
);

const DemoBlogPostPage = React.lazy(() =>
  import(
    /* webpackChunkName: "DemoBlogPostPage" */ '@/pages/DemoBlog/DemoBlogPost'
  ).then(module => ({
    default: module.DemoBlogPostPage,
  }))
);

const WalletProfile = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletProfilePage" */ '@/config/pages/walletProfileExtension'
  ).then(module => ({
    default: module.WalletProfileExtension,
  }))
);

const OAuthProfile = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthProfilePage" */ '@/config/pages/oauthProfileExtension'
  ).then(module => ({
    default: module.OAuthProfileExtension,
  }))
);

// =============================================================================
// USER PAGE ROUTES - Define your page routes below
// =============================================================================

/**
 * User page routes factory
 * This function receives the translation function and returns the page routes
 * Add your custom routes here by adding PageType objects to the returned array
 *
 * @param t - Translation function from useTranslation hook
 * @returns Array of PageType objects representing your application pages
 */
export const getUserPageRoutes = (t: TFunction): PageType[] => {
  // AI Assistant Demo Route
  const DemoAIAssistantRoute: PageType = {
    id: 'demo-ai-assistant',
    path: 'demo-ai-assistant',
    element: <DemoAIAssistantPage />,
    menuLabel: t('Demo AI Assistant', { ns: 'menu' }),
    fullWidth: true,
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

  // Demo Auth Parent Route with sub-routes
  const DemoAuthRoute: PageType = {
    id: 'demo-auth',
    path: 'auth',
    element: <DemoAuth />,
    menuLabel: t('Demo Auth', { ns: 'menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
    subRoutes: [
      {
        path: 'wallet-basic',
        element: <WalletBasic />,
        menuLabel: t('Wallet - Basic', { ns: 'menu' }),
        protectionType: ProtectionType.NONE,
        icon: <IoWallet size={18} />,
      },
      {
        path: 'wallet-protected',
        element: <WalletProtected />,
        menuLabel: t('Wallet - Protected', { ns: 'menu' }),
        protectionType: ProtectionType.WALLET,
        icon: <IoWalletOutline size={18} />,
      },
      {
        path: 'oauth',
        element: <OAuthDemo />,
        menuLabel: t('OAuth - Basic', { ns: 'menu' }),
        protectionType: ProtectionType.NONE,
        icon: <IoLogIn size={18} />,
      },
      {
        path: 'oauth-protected',
        element: <OAuthProtected />,
        menuLabel: t('OAuth - Protected', { ns: 'menu' }),
        protectionType: ProtectionType.OAUTH,
        icon: <IoShieldCheckmark size={18} />,
      },
      {
        path: 'combined',
        element: <CombinedAuth />,
        menuLabel: t('Combined Auth', { ns: 'menu' }),
        protectionType: ProtectionType.BOTH,
        icon: <IoShield size={18} />,
      },
    ],
  };

  // Demo Blog Route with sub-routes
  const DemoBlogRoute: PageType = {
    id: 'demo-blog',
    path: 'blog',
    element: <DemoBlogPage />,
    menuLabel: t('Demo Blog', { ns: 'menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
    subRoutes: [
      {
        path: ':postId',
        element: <DemoBlogPostPage />,
        menuLabel: null,
        protectionType: ProtectionType.NONE,
      },
    ],
  };

  // Wallet Profile Route
  const WalletProfileRoute: PageType = {
    id: 'wallet-profile',
    path: 'wallet-profile',
    element: <WalletProfile />,
    menuLabel: null,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.WALLET,
  };

  // OAuth Profile Route
  const OAuthProfileRoute: PageType = {
    id: 'oauth-profile',
    path: 'oauth-profile',
    element: <OAuthProfile />,
    menuLabel: null,
    isShownInMainMenu: false,
    isShownInSecondaryMenu: false,
    protectionType: ProtectionType.OAUTH,
  };

  // Add your page routes to this array
  return [
    DemoAuthRoute,
    DemoBlogRoute,
    DemoAIAssistantRoute,
    WalletProfileRoute,
    OAuthProfileRoute,
  ];
};
