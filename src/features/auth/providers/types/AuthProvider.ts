export type AuthProviderName = 'google' | 'apple' | 'github';

export interface AuthProviderCredentials {
  token: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthProvider {
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
