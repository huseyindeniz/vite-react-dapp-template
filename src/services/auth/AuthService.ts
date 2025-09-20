import log from 'loglevel';

import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';
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

  // High-level auth operations that combine provider + API calls

  /**
   * Complete login flow with a provider
   * Handles provider login + token exchange with backend
   */
  async loginWithProvider(
    providerName: AuthProviderName
  ): Promise<AuthSession> {
    log.debug(`Starting login flow with provider: ${providerName}`);

    // Get provider
    const provider = this.getProvider(providerName);

    // Initialize provider if needed
    if (!provider.isAvailable()) {
      await this.initializeProvider(providerName);

      if (!provider.isAvailable()) {
        throw new Error(`Provider ${providerName} is not available`);
      }
    }

    // Get credentials from provider (with decoded user info)
    const credentials: AuthProviderCredentials = await provider.login();

    // Exchange token with backend
    const session: AuthSession = await this.authApi.exchangeToken({
      provider: providerName,
      idToken: credentials.token,
      email: credentials.email,
    });

    // Set user info from credentials
    if (session.user) {
      session.user.name = credentials.given_name ?? credentials.name ?? '';
      session.user.avatarUrl = credentials.picture || '';
      session.user.id =
        credentials.sub || `${providerName}_${credentials.email}`;
    }

    log.debug(`Login successful with provider: ${providerName}`);

    return session;
  }

  /**
   * Complete logout flow
   * Handles provider logout + backend logout
   */
  async logout(
    accessToken: string,
    providerName: AuthProviderName
  ): Promise<void> {
    log.debug('Starting logout flow');

    // Logout from backend first
    try {
      await this.authApi.logout(accessToken);
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

  // Direct API methods (delegated to AuthApi)

  async exchangeToken(request: AuthTokenExchangeRequest): Promise<AuthSession> {
    return this.authApi.exchangeToken(request);
  }

  async refreshToken(request: AuthTokenRefreshRequest): Promise<AuthSession> {
    return this.authApi.refreshToken(request);
  }

  // Utility methods

  // Token storage methods (delegate to AuthApi)

  async storeTokens(
    accessToken: string,
    refreshToken: string,
    provider: AuthProviderName
  ): Promise<void> {
    return this.authApi.storeTokens(accessToken, refreshToken, provider);
  }

  async getStoredTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    provider: AuthProviderName | null;
  }> {
    return this.authApi.getStoredTokens();
  }

  async clearStoredTokens(): Promise<void> {
    return this.authApi.clearStoredTokens();
  }

  /**
   * Reset the service (mainly for testing)
   */
  reset(): void {
    this.providerService.reset();
    log.debug('AuthService reset');
  }
}
