import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthUser } from '@/features/auth/models/types/AuthUser';

export interface IAuthApi {
  /**
   * Exchange OAuth provider token for user info
   * Backend sets httpOnly cookies automatically
   */
  exchangeToken: (request: AuthTokenExchangeRequest) => Promise<{
    user: AuthUser;
  }>;

  /**
   * Logout and clear httpOnly cookies
   */
  logout: () => Promise<void>;
}