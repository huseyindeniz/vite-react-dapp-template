export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
}