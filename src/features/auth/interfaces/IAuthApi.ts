import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';

import { AuthProviderName } from '../types/IAuthProvider';

export interface IAuthApi {
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
  logout: (accessToken: string) => Promise<void>;


  /**
   * Store auth tokens securely (httpOnly cookies)
   */
  storeTokens: (accessToken: string, refreshToken: string, provider: AuthProviderName) => Promise<void>;

  /**
   * Retrieve stored auth tokens
   */
  getStoredTokens: () => Promise<{ accessToken: string | null; refreshToken: string | null; provider: AuthProviderName | null }>;

  /**
   * Clear stored auth tokens
   */
  clearStoredTokens: () => Promise<void>;
}