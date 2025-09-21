import log from 'loglevel';

import { getAuthProviderByName } from '@/features/auth/config';
import { AuthUser } from '@/features/auth/models/types/AuthUser';
import {
  AuthProviderCredentials,
  AuthProviderName,
  IAuthProvider,
} from '@/features/auth/types/IAuthProvider';
import { IAuthService } from '@/features/auth/types/IAuthService';

import { AuthApi } from './AuthApi';
import { AuthProviderService } from './providers/AuthProviderService';

/**
 * Unified auth service that combines API calls and provider management
 * Provides high-level auth operations for the application
 * Implements IAuthService interface from features layer
 */
export class AuthService implements IAuthService {
  private static instance: AuthService;
  private authApi: AuthApi;
  private providerService: AuthProviderService;

  private constructor() {
    this.authApi = AuthApi.getInstance();
    this.providerService = AuthProviderService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Provider management methods
  registerProvider(provider: IAuthProvider): void {
    this.providerService.registerProvider(provider);
  }

  getProvider(name: AuthProviderName): IAuthProvider {
    return this.providerService.getProvider(name);
  }

  getSupportedProviders(): IAuthProvider[] {
    return this.providerService.getSupportedProviders();
  }

  hasProvider(name: AuthProviderName): boolean {
    return this.providerService.hasProvider(name);
  }

  async initializeProviders(): Promise<void> {
    return this.providerService.initializeAll();
  }

  async initializeProvider(name: AuthProviderName): Promise<void> {
    return this.providerService.initializeProvider(name);
  }

  isProviderAvailable(name: AuthProviderName): boolean {
    return this.providerService.isProviderAvailable(name);
  }

  getAvailableProviders(): IAuthProvider[] {
    return this.providerService.getAvailableProviders();
  }

  // High-level auth operations that support immediate feedback + backend validation

  /**
   * Get credentials from provider (for immediate UI feedback)
   */
  async getProviderCredentials(
    providerName: AuthProviderName
  ): Promise<AuthProviderCredentials> {
    log.debug(`Getting credentials from provider: ${providerName}`);

    // Get provider
    const provider = this.getProvider(providerName);

    // Initialize provider if needed
    if (!provider.isAvailable()) {
      await this.initializeProvider(providerName);

      if (!provider.isAvailable()) {
        throw new Error(`Provider ${providerName} is not available`);
      }
    }

    // Get credentials from provider (includes immediate user data)
    const credentials: AuthProviderCredentials = await provider.login();

    log.debug(`Got credentials from provider: ${providerName}`);
    return credentials;
  }

  /**
   * Exchange authorization code with backend for validated user data
   */
  async exchangeTokenWithBackend(
    providerName: AuthProviderName,
    credentials: AuthProviderCredentials
  ): Promise<{ user: AuthUser }> {
    log.debug(`Exchanging token with backend for provider: ${providerName}`);

    // Exchange with backend - get token type from provider config
    const providerConfig = getAuthProviderByName(providerName);
    const tokenType = providerConfig.tokenType;

    const authResult = await this.authApi.exchangeToken({
      provider: providerName,
      token: credentials.token,
      tokenType,
      email: credentials.email,
      name: credentials.name,
      given_name: credentials.given_name,
      picture: credentials.picture,
      sub: credentials.sub,
    });

    log.debug(`Backend exchange successful for provider: ${providerName}`);

    return authResult;
  }

  /**
   * Complete login flow with a provider (legacy method for backward compatibility)
   * @deprecated Use getProviderCredentials + exchangeTokenWithBackend for better UX
   */
  async loginWithProvider(
    providerName: AuthProviderName
  ): Promise<{ user: AuthUser }> {
    const credentials = await this.getProviderCredentials(providerName);
    return await this.exchangeTokenWithBackend(providerName, credentials);
  }

  /**
   * Complete logout flow
   * Handles provider logout + backend logout via httpOnly cookies
   */
  async logout(providerName?: AuthProviderName): Promise<void> {
    log.debug('Starting logout flow');

    // Logout from backend - backend will clear httpOnly cookies
    try {
      await this.authApi.logout();
    } catch (error) {
      log.warn('Backend logout failed:', error);
      // Continue with provider logout even if backend fails
    }

    // Logout from provider if specified
    if (providerName) {
      try {
        await this.providerService.logoutProvider(providerName);
      } catch (error) {
        log.warn(`Provider ${providerName} logout failed:`, error);
        // Don't throw - logout should be best effort
      }
    }

    log.debug('Logout completed');
  }

  // Utility methods

  /**
   * Reset the service (mainly for testing)
   */
  reset(): void {
    this.providerService.reset();
    log.debug('AuthService reset');
  }
}
