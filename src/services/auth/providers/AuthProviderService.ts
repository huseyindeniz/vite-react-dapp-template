import log from 'loglevel';

import { AuthProviderName, IAuthProvider } from '@/features/auth/types/IAuthProvider';
import { IAuthProviderService } from '@/features/auth/types/IAuthProviderService';

/**
 * Service for managing auth provider instances
 * Follows singleton pattern like other services in the codebase
 */
export class AuthProviderService implements IAuthProviderService {
  private static instance: AuthProviderService;
  private providers = new Map<AuthProviderName, IAuthProvider>();
  private initialized = false;

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): AuthProviderService {
    if (!AuthProviderService.instance) {
      AuthProviderService.instance = new AuthProviderService();
    }
    return AuthProviderService.instance;
  }

  /**
   * Register an auth provider with the service
   */
  registerProvider(provider: IAuthProvider): void {
    log.debug(`Registering auth provider: ${provider.name}`);
    this.providers.set(provider.name, provider);
  }

  /**
   * Get provider by name
   */
  getProvider(name: AuthProviderName): IAuthProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      const availableProviders = Array.from(this.providers.keys()).join(', ');
      throw new Error(`Auth provider ${name} not found. Available providers: ${availableProviders}`);
    }
    return provider;
  }

  /**
   * Get all registered providers
   */
  getSupportedProviders(): IAuthProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check if a provider is registered
   */
  hasProvider(name: AuthProviderName): boolean {
    return this.providers.has(name);
  }

  /**
   * Initialize all registered providers
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) {
      log.debug('Auth providers already initialized');
      return;
    }

    log.debug('Initializing all auth providers...');
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
    log.debug('Auth provider initialization completed');
  }

  /**
   * Initialize a specific provider
   */
  async initializeProvider(name: AuthProviderName): Promise<void> {
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
  isProviderAvailable(name: AuthProviderName): boolean {
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
  getAvailableProviders(): IAuthProvider[] {
    return this.getSupportedProviders().filter(provider => provider.isAvailable());
  }

  /**
   * Logout from a specific provider
   */
  async logoutProvider(name: AuthProviderName): Promise<void> {
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
    log.debug('AuthProviderService reset');
  }
}