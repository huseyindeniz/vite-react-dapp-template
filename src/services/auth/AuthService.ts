import log from 'loglevel';

import { getOAuthProviderByName } from '@/features/oauth/config';
import { OAuthUser } from '@/features/oauth/models/session/types/OAuthUser';
import {
  OAuthProviderCredentials,
  OAuthProviderName,
  IOAuthProvider,
} from '@/features/oauth/types/IOAuthProvider';
import { IOAuthService } from '@/features/oauth/types/IOAuthService';

import { AuthApi } from './AuthApi';
import { AuthProviderService } from './providers/AuthProviderService';

/**
 * Unified auth service that combines API calls and provider management
 * Provides high-level auth operations for the application
 * Implements IOAuthService interface from features layer
 */
export class AuthService implements IOAuthService {
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
  registerProvider(provider: IOAuthProvider): void {
    this.providerService.registerProvider(provider);
  }

  getProvider(name: OAuthProviderName): IOAuthProvider {
    return this.providerService.getProvider(name);
  }

  getSupportedProviders(): IOAuthProvider[] {
    return this.providerService.getSupportedProviders();
  }

  hasProvider(name: OAuthProviderName): boolean {
    return this.providerService.hasProvider(name);
  }

  async initializeProviders(): Promise<void> {
    return this.providerService.initializeAll();
  }

  async initializeProvider(name: OAuthProviderName): Promise<void> {
    return this.providerService.initializeProvider(name);
  }

  isProviderAvailable(name: OAuthProviderName): boolean {
    return this.providerService.isProviderAvailable(name);
  }

  getAvailableProviders(): IOAuthProvider[] {
    return this.providerService.getAvailableProviders();
  }

  // High-level auth operations that support immediate feedback + backend validation

  /**
   * Get credentials from provider (for immediate UI feedback)
   */
  async getProviderCredentials(
    providerName: OAuthProviderName
  ): Promise<OAuthProviderCredentials> {
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
    const credentials: OAuthProviderCredentials = await provider.login();

    log.debug(`Got credentials from provider: ${providerName}`);
    return credentials;
  }

  /**
   * Exchange authorization code with backend for validated user data
   */
  async exchangeTokenWithBackend(
    providerName: OAuthProviderName,
    credentials: OAuthProviderCredentials
  ): Promise<{ user: OAuthUser }> {
    log.debug(`Exchanging token with backend for provider: ${providerName}`);

    // Exchange with backend - get token type from provider config
    const providerConfig = getOAuthProviderByName(providerName);
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
    providerName: OAuthProviderName
  ): Promise<{ user: OAuthUser }> {
    const credentials = await this.getProviderCredentials(providerName);
    return await this.exchangeTokenWithBackend(providerName, credentials);
  }

  /**
   * Complete logout flow
   * Handles provider logout + backend logout via httpOnly cookies
   */
  async logout(providerName?: OAuthProviderName): Promise<void> {
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
