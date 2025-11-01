export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  given_name?: string;
  avatarUrl?: string;
  provider: string;
}