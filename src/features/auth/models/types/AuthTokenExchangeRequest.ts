export interface AuthTokenExchangeRequest {
  provider: 'google' | 'apple' | 'github';
  token: string;
  tokenType: 'authorization_code' | 'access_token';
  email?: string;
}