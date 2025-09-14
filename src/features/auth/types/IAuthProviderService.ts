import { AuthProviderName, IAuthProvider } from './IAuthProvider';

export interface IAuthProviderService {
  /**
   * Initialize all registered providers
   */
  initializeAll: () => Promise<void>;

  /**
   * Get a specific provider by name
   */
  getProvider: (name: AuthProviderName) => IAuthProvider;

  /**
   * Get all supported providers
   */
  getSupportedProviders: () => IAuthProvider[];

  /**
   * Register a new provider
   */
  registerProvider: (provider: IAuthProvider) => void;

  /**
   * Check if a provider is registered
   */
  hasProvider: (name: AuthProviderName) => boolean;
}