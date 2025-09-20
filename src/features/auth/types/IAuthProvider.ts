import { SUPPORTED_AUTH_PROVIDERS } from '@/features/auth/config';

// Automatically derive provider names from config - no more hardcoding!
export type AuthProviderName =
  (typeof SUPPORTED_AUTH_PROVIDERS)[number]['name'];

export interface AuthProviderCredentials {
  token: string; // ID token
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  sub?: string; // Subject ID from provider
}

export interface IAuthProvider {
  name: AuthProviderName;
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
  login: () => Promise<AuthProviderCredentials>;

  /**
   * Logout from the provider
   */
  logout: () => Promise<void>;

  /**
   * Check if the provider is available/ready
   */
  isAvailable: () => boolean;
}
