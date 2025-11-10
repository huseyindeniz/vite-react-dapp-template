export interface OAuthProviderCredentials {
  token: string;
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  sub?: string; // Provider-specific user ID
  [key: string]: unknown;
}
