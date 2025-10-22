import { AuthTokenExchangeRequest } from './types/AuthTokenExchangeRequest';
import { AuthUser } from './types/AuthUser';

export interface ISessionApi {
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
