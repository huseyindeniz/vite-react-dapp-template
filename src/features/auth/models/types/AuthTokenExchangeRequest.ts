import { AuthProviderName } from '@/features/auth/types/IAuthProvider';

export interface AuthTokenExchangeRequest {
  provider: AuthProviderName;
  token: string;
  tokenType: 'authorization_code' | 'access_token';
  email?: string;
}