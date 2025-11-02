import log from 'loglevel';

import { IOAuthProvider } from '@/features/oauth/models/provider/IOAuthProvider';
import { IOAuthProviderService } from '@/features/oauth/models/provider/IOAuthProviderService';
import { OAuthProviderName } from '@/features/oauth/models/provider/types/OAuthProviderName';

/**
 * Service for managing OAuth provider instances
 * Follows singleton pattern like other services in the codebase
 */
export class OAuthProviderService implements IOAuthProviderService {
  private static instance: OAuthProviderService;
  private providers = new Map<OAuthProviderName, IOAuthProvider>();
  private initialized = false;

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): OAuthProviderService {
    if (!OAuthProviderService.instance) {
      OAuthProviderService.instance = new OAuthProviderService();
    }
    return OAuthProviderService.instance;
  }

  /**
   * Register an OAuth provider with the service
   */
  registerProvider(provider: IOAuthProvider): void {
    log.debug(`Registering OAuth provider: ${provider.name}`);
    this.providers.set(provider.name, provider);
  }

  /**
   * Get provider by name
   */
  getProvider(name: OAuthProviderName): IOAuthProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      const availableProviders = Array.from(this.providers.keys()).join(', ');
      throw new Error(
        `OAuth provider ${name} not found. Available providers: ${availableProviders}`
      );
    }
    return provider;
  }

  /**
   * Get all registered providers
   */
  getSupportedProviders(): IOAuthProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check if a provider is registered
   */
  hasProvider(name: OAuthProviderName): boolean {
    return this.providers.has(name);
  }

  /**
   * Initialize all registered providers
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) {
      log.debug('OAuth providers already initialized');
      return;
    }

    log.debug('Initializing all OAuth providers...');
    const initPromises = this.getSupportedProviders().map(async provider => {
      try {
        await provider.initialize();
        log.debug(`Successfully initialized provider: ${provider.name}`);
      } catch (error) {
        log.warn(`Failed to initialize provider ${provider.name}:`, error);
        // Don't throw - allow other providers to initialize
      }
    });

    await Promise.allSettled(initPromises);
    this.initialized = true;
    log.debug('OAuth provider initialization completed');
  }

  /**
   * Initialize a specific provider
   */
  async initializeProvider(name: OAuthProviderName): Promise<void> {
    const provider = this.getProvider(name);
    try {
      await provider.initialize();
      log.debug(`Successfully initialized provider: ${name}`);
    } catch (error) {
      log.error(`Failed to initialize provider ${name}:`, error);
      throw error;
    }
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(name: OAuthProviderName): boolean {
    try {
      const provider = this.getProvider(name);
      return provider.isAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Get all available (ready to use) providers
   */
  getAvailableProviders(): IOAuthProvider[] {
    return this.getSupportedProviders().filter(provider =>
      provider.isAvailable()
    );
  }

  /**
   * Logout from a specific provider
   */
  async logoutProvider(name: OAuthProviderName): Promise<void> {
    const provider = this.getProvider(name);
    try {
      await provider.logout();
      log.debug(`Successfully logged out from provider: ${name}`);
    } catch (error) {
      log.warn(`Failed to logout from provider ${name}:`, error);
      // Don't throw - logout should be best effort
    }
  }

  /**
   * Reset the service (mainly for testing)
   */
  reset(): void {
    this.providers.clear();
    this.initialized = false;
    log.debug('OAuthProviderService reset');
  }
}
