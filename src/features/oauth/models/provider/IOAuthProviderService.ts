import { IOAuthProvider } from './IOAuthProvider';
import { OAuthProviderName } from './types/OAuthProviderName';

export interface IOAuthProviderService {
  /**
   * Initialize all registered providers
   */
  initializeAll: () => Promise<void>;

  /**
   * Get a specific provider by name
   */
  getProvider: (name: OAuthProviderName) => IOAuthProvider;

  /**
   * Get all supported providers
   */
  getSupportedProviders: () => IOAuthProvider[];

  /**
   * Register a new provider
   */
  registerProvider: (provider: IOAuthProvider) => void;

  /**
   * Check if a provider is registered
   */
  hasProvider: (name: OAuthProviderName) => boolean;
}
