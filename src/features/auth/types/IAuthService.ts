import { AuthUser } from '@/features/auth/models/types/AuthUser';

import { AuthProviderName, IAuthProvider } from './IAuthProvider';

export interface IAuthService {
  // Provider management methods
  /**
   * Initialize all auth providers
   */
  initializeProviders: () => Promise<void>;

  /**
   * Get a specific provider by name
   */
  getProvider: (name: AuthProviderName) => IAuthProvider;

  /**
   * Get all supported providers
   */
  getSupportedProviders: () => IAuthProvider[];

  /**
   * Login with a specific provider and exchange token
   * Backend sets httpOnly cookies automatically
   */
  loginWithProvider: (providerName: AuthProviderName) => Promise<{
    user: AuthUser;
  }>;

  /**
   * Logout and clear httpOnly cookies
   */
  logout: (providerName?: AuthProviderName) => Promise<void>;
}
