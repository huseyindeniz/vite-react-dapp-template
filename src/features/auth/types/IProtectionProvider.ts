import { JSX } from 'react';

import { ProtectionType } from '@/config/auth/ProtectionType';

/**
 * Interface for authentication/protection providers
 * Domain features (wallet, oauth) implement this to provide protection capabilities
 */
export interface IProtectionProvider {
  /**
   * The type of protection this provider handles
   */
  protectionType: ProtectionType;

  /**
   * HOC to wrap protected routes
   */
  withProtection: (element: JSX.Element) => JSX.Element;

  /**
   * Hook to check authentication status (optional)
   * Used for filtering menu items based on auth state
   */
  useAuthentication?: () => { isAuthenticated: boolean };

  /**
   * Hook to handle post-login redirects (optional)
   */
  usePostLoginRedirect?: () => void;

  /**
   * Get auth-specific routes (e.g., OAuth callback routes)
   * Returns router-specific route types (PageType, RouteObject, etc.)
   */
  getAuthRoutes?: () => unknown[];
}
