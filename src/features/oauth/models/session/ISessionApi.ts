import { OAuthTokenExchangeRequest } from './types/OAuthTokenExchangeRequest';
import { OAuthUser } from './types/OAuthUser';

export interface ISessionApi {
  /**
   * Exchange OAuth provider token for user info
   * Backend sets httpOnly cookies automatically
   */
  exchangeToken: (request: OAuthTokenExchangeRequest) => Promise<{
    user: OAuthUser;
  }>;

  /**
   * Logout and clear httpOnly cookies
   */
  logout: () => Promise<void>;
}
