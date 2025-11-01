import { SUPPORTED_OAUTH_PROVIDERS } from '@/features/oauth/config';

// Automatically derive provider names from config - no more hardcoding!
export type OAuthProviderName = typeof SUPPORTED_OAUTH_PROVIDERS[number]['name'];

export interface OAuthProviderCredentials {
  token: string;
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  sub?: string; // Provider-specific user ID
  [key: string]: unknown;
}

export interface IOAuthProvider {
  name: OAuthProviderName;
  label: string;
  icon?: string;
  color?: string;

  /**
   * Initialize the auth provider (load SDK, setup, etc.)
   */
  initialize: () => Promise<void>;

  /**
   * Trigger the OAuth login flow
   */
  login: () => Promise<OAuthProviderCredentials>;

  /**
   * Logout from the provider
   */
  logout: () => Promise<void>;

  /**
   * Check if the provider is available/ready
   */
  isAvailable: () => boolean;
}