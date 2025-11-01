import { OAuthProviderName } from '@/features/oauth/types/IOAuthProvider';

export interface OAuthTokenExchangeRequest {
  provider: OAuthProviderName;
  token: string;
  tokenType: 'authorization_code' | 'access_token';
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  sub?: string; // Provider-specific user ID
}