import { AuthUser } from './AuthUser';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser | null; // User can be null during session restoration
}