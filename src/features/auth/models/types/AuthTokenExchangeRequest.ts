import { AuthProviderName } from '@/features/auth/types/IAuthProvider';

export interface AuthTokenExchangeRequest {
  provider: AuthProviderName;
  idToken: string;
  email?: string;
}