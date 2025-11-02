import log from 'loglevel';

import { getOAuthProviderByName } from '@/features/oauth/config';
import { IOAuthApi } from '@/features/oauth/IOAuthApi';
import { IOAuthProvider } from '@/features/oauth/models/provider/IOAuthProvider';
import { OAuthProviderCredentials } from '@/features/oauth/models/provider/types/OAuthProviderCredentials';
import { OAuthProviderName } from '@/features/oauth/models/provider/types/OAuthProviderName';
import { OAuthTokenExchangeRequest } from '@/features/oauth/models/session/types/OAuthTokenExchangeRequest';
import { OAuthUser } from '@/features/oauth/models/session/types/OAuthUser';

import { OAuthApi } from './OAuthApi';
import { OAuthProviderService } from './providers/OAuthProviderService';

/**
 * Unified OAuth service that combines API calls and provider management
 * Provides high-level OAuth operations for the application
 * Implements IOAuthApi interface from features layer
 */
export class OAuthService implements IOAuthApi {
  private static instance: OAuthService;
  private oauthApi: OAuthApi;
  private providerService: OAuthProviderService;

  private constructor() {
    this.oauthApi = OAuthApi.getInstance();
    this.providerService = OAuthProviderService.getInstance();
  }

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
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

  // Session API methods (delegated to OAuthApi)

  async exchangeToken(
    request: OAuthTokenExchangeRequest
  ): Promise<{ user: OAuthUser }> {
    return this.oauthApi.exchangeToken(request);
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

    const authResult = await this.oauthApi.exchangeToken({
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
      await this.oauthApi.logout();
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
    log.debug('OAuthService reset');
  }
}
