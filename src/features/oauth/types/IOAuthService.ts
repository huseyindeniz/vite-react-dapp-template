import { OAuthUser } from '@/features/oauth/models/session/types/OAuthUser';

import { OAuthProviderName, OAuthProviderCredentials, IOAuthProvider } from './IOAuthProvider';

export interface IOAuthService {
  // Provider management methods
  /**
   * Initialize all auth providers
   */
  initializeProviders: () => Promise<void>;

  /**
   * Get a specific provider by name
   */
  getProvider: (name: OAuthProviderName) => IOAuthProvider;

  /**
   * Get all supported providers
   */
  getSupportedProviders: () => IOAuthProvider[];

  /**
   * Get credentials from provider (for immediate UI feedback)
   */
  getProviderCredentials: (providerName: OAuthProviderName) => Promise<OAuthProviderCredentials>;

  /**
   * Exchange authorization code with backend for validated user data
   */
  exchangeTokenWithBackend: (
    providerName: OAuthProviderName,
    credentials: OAuthProviderCredentials
  ) => Promise<{ user: OAuthUser }>;

  /**
   * Login with a specific provider and exchange token
   * Backend sets httpOnly cookies automatically
   * @deprecated Use getProviderCredentials + exchangeTokenWithBackend for better UX
   */
  loginWithProvider: (providerName: OAuthProviderName) => Promise<{
    user: OAuthUser;
  }>;

  /**
   * Logout and clear httpOnly cookies
   */
  logout: (providerName?: OAuthProviderName) => Promise<void>;
}
