export interface AuthTokenExchangeRequest {
  provider: 'google' | 'apple' | 'github';
  token: string;
  email?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

export interface AuthTokenRefreshRequest {
  refreshToken: string;
}

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