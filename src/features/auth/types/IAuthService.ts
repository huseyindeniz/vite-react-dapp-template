import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';
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
   */
  loginWithProvider: (providerName: AuthProviderName) => Promise<AuthSession>;

  // API methods (from IAuthApi)
  /**
   * Exchange OAuth provider token for app session
   */
  exchangeToken: (request: AuthTokenExchangeRequest) => Promise<AuthSession>;

  /**
   * Refresh app session token
   */
  refreshToken: (request: AuthTokenRefreshRequest) => Promise<AuthSession>;

  /**
   * Logout and invalidate session
   */
  logout: (
    accessToken: string,
    providerName: AuthProviderName
  ) => Promise<void>;

  /**
   * Validate current session
   */
  validateSession: (accessToken: string) => Promise<AuthUser>;
}
