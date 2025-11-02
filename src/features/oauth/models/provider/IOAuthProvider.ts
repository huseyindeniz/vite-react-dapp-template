import { OAuthProviderCredentials } from './types/OAuthProviderCredentials';
import { OAuthProviderName } from './types/OAuthProviderName';

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