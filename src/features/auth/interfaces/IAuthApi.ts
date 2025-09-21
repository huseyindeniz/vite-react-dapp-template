import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';
import { AuthUser } from '@/features/auth/models/types/AuthUser';

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
   * Validate current session
   */
  validateSession: (accessToken: string) => Promise<AuthUser>;
}