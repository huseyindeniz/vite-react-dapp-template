import React from 'react';

import {
  IoWallet,
  IoWalletOutline,
  IoLogIn,
  IoShieldCheckmark,
  IoShield,
} from 'react-icons/io5';

import { PageType } from '@/features/router/types/PageType';
import { ProtectionType } from '@/features/router/types/ProtectionType';

// =============================================================================
// USER PAGE IMPORTS - Add your page imports below
// =============================================================================

const AiChatPage = React.lazy(() =>
  import(/* webpackChunkName: "AiChatPage" */ '@/pages/AiChat/AiChat').then(
    module => ({
      default: module.AiChatPage,
    })
  )
);

// Auth Demo Parent Page
const AuthDemo = React.lazy(() =>
  import(
    /* webpackChunkName: "AuthDemoPage" */ '@/pages/AuthDemo/AuthDemo'
  ).then(module => ({
    default: module.AuthDemo,
  }))
);

// Auth Demo Sub-pages
const WalletBasic = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletBasicPage" */ '@/pages/AuthDemo/WalletBasic/WalletBasic'
  ).then(module => ({
    default: module.WalletBasic,
  }))
);

const WalletProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "WalletProtectedPage" */ '@/pages/AuthDemo/WalletProtected/WalletProtected'
  ).then(module => ({
    default: module.WalletProtected,
  }))
);

const OAuthDemo = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthDemoPage" */ '@/pages/AuthDemo/OAuthDemo/OAuthDemo'
  ).then(module => ({
    default: module.OAuthDemo,
  }))
);

const OAuthProtected = React.lazy(() =>
  import(
    /* webpackChunkName: "OAuthProtectedPage" */ '@/pages/AuthDemo/OAuthProtected/OAuthProtected'
  ).then(module => ({
    default: module.OAuthProtected,
  }))
);

const CombinedAuth = React.lazy(() =>
  import(
    /* webpackChunkName: "CombinedAuthPage" */ '@/pages/AuthDemo/CombinedAuth/CombinedAuth'
  ).then(module => ({
    default: module.CombinedAuth,
  }))
);

const BlogPage = React.lazy(() =>
  import(/* webpackChunkName: "BlogPage" */ '@/pages/Blog/Blog').then(
    module => ({
      default: module.Blog,
    })
  )
);

const BlogPostPage = React.lazy(() =>
  import(/* webpackChunkName: "BlogPostPage" */ '@/pages/Blog/BlogPost').then(
    module => ({
      default: module.BlogPost,
    })
  )
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
export const getUserPageRoutes = (
  t: (key: string, options?: { ns?: string }) => string
): PageType[] => {
  // AI Chat Route
  const AiChatRoute: PageType = {
    id: 'ai-chat',
    path: 'ai-chat',
    element: <AiChatPage />,
    menuLabel: t('AI Chat', { ns: 'Menu' }),
    isShownInMainMenu: true,
    isShownInSecondaryMenu: true,
    protectionType: ProtectionType.NONE,
  };

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
        icon: <IoWallet size={18} />,
      },
      {
        path: 'wallet-protected',
        element: <WalletProtected />,
        menuLabel: t('Wallet - Protected', { ns: 'Menu' }),
        protectionType: ProtectionType.WALLET,
        icon: <IoWalletOutline size={18} />,
      },
      {
        path: 'oauth',
        element: <OAuthDemo />,
        menuLabel: t('OAuth - Basic', { ns: 'Menu' }),
        protectionType: ProtectionType.NONE,
        icon: <IoLogIn size={18} />,
      },
      {
        path: 'oauth-protected',
        element: <OAuthProtected />,
        menuLabel: t('OAuth - Protected', { ns: 'Menu' }),
        protectionType: ProtectionType.AUTH,
        icon: <IoShieldCheckmark size={18} />,
      },
      {
        path: 'combined',
        element: <CombinedAuth />,
        menuLabel: t('Combined Auth', { ns: 'Menu' }),
        protectionType: ProtectionType.BOTH,
        icon: <IoShield size={18} />,
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

  // Add your page routes to this array
  return [AiChatRoute, AuthDemoRoute, BlogHome, BlogPostRoute];
};
