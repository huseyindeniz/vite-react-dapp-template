import { AuthUser } from '@/features/auth/models/types/AuthUser';

import { AuthProviderName, AuthProviderCredentials, IAuthProvider } from './IAuthProvider';

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
   * Get credentials from provider (for immediate UI feedback)
   */
  getProviderCredentials: (providerName: AuthProviderName) => Promise<AuthProviderCredentials>;

  /**
   * Exchange authorization code with backend for validated user data
   */
  exchangeTokenWithBackend: (
    providerName: AuthProviderName,
    credentials: AuthProviderCredentials
  ) => Promise<{ user: AuthUser }>;

  /**
   * Login with a specific provider and exchange token
   * Backend sets httpOnly cookies automatically
   * @deprecated Use getProviderCredentials + exchangeTokenWithBackend for better UX
   */
  loginWithProvider: (providerName: AuthProviderName) => Promise<{
    user: AuthUser;
  }>;

  /**
   * Logout and clear httpOnly cookies
   */
  logout: (providerName?: AuthProviderName) => Promise<void>;
}
