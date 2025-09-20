import log from 'loglevel';

import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';
import { AuthUser } from '@/features/auth/models/types/AuthUser';
import { AuthProviderName } from '@/features/auth/types/IAuthProvider';

import { IAuthApi } from '../../features/auth/interfaces/IAuthApi';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Auth API service - shows required backend endpoints
 * Currently returns mock data for development
 */
export class AuthApi implements IAuthApi {
  private static instance: AuthApi;
  private readonly baseDelay = 500; // Simulate network delay

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  private delay(ms: number = this.baseDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateMockToken(length: number = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  async exchangeToken(request: AuthTokenExchangeRequest): Promise<AuthSession> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/token/exchange
    // Body: { provider: string, idToken: string, email?: string }
    // Response: { accessToken: string, refreshToken: string, expiresAt: number, user: AuthUser }
    //
    // ID Token Flow:
    // 1. Verify ID token with Google/provider directly
    // 2. Extract user info from verified token
    // 3. Issue your own JWT access/refresh tokens
    /*
    const response = await fetch(`http://localhost:3001/api/auth/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        provider: request.provider,
        idToken: request.idToken,
        email: request.email
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token exchange failed');
    }

    return await response.json();
    */

    // MOCK IMPLEMENTATION (remove when backend is ready)
    await this.delay();

    log.debug('AuthApi.exchangeToken called with provider:', request.provider);

    if (!request.idToken) {
      throw new Error('Invalid ID token');
    }

    // Simulate random failures for testing
    if (Math.random() < 0.05) {
      throw new Error('Token exchange failed');
    }

    // Generate JWT tokens
    const accessToken = this.generateMockToken(64);
    const refreshToken = this.generateMockToken(48);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Use user info from GoogleAuthProvider (already decoded)
    const user: AuthUser = {
      id: `${request.provider}_${request.email}`,
      email: request.email || '',
      name: '', // Will be set by AuthService from credentials
      avatarUrl: '', // Will be set by AuthService from credentials
      provider: request.provider,
    };

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user,
    };
  }

  async refreshToken(request: AuthTokenRefreshRequest): Promise<AuthSession> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/token/refresh
    // Body: { refreshToken: string }
    // Response: { accessToken: string, refreshToken: string, expiresAt: number, user: AuthUser }
    /*
    const response = await fetch(`http://localhost:3001/api/auth/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        refreshToken: request.refreshToken
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    return await response.json();
    */

    // MOCK IMPLEMENTATION (remove when backend is ready)
    await this.delay();

    if (!request.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Simulate token refresh failure
    if (Math.random() < 0.1) {
      throw new Error('Refresh token expired');
    }

    const accessToken = this.generateMockToken(64);
    const refreshToken = this.generateMockToken(48);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // User data comes from stored session in production
    const user: AuthUser = {
      id: '',
      email: '',
      name: '',
      avatarUrl: '',
      provider: 'google', // Will be retrieved from stored session
    };

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user,
    };
  }

  async logout(accessToken: string): Promise<void> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/logout
    // Headers: { Authorization: 'Bearer ${accessToken}' }
    // Response: 204 No Content
    /*
    const response = await fetch(`http://localhost:3001/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }
    */

    // MOCK IMPLEMENTATION (remove when backend is ready)
    await this.delay(200);

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    log.debug(
      `Mock logout successful for token: ${accessToken.slice(0, 8)}...`
    );
  }


  // Token Storage Methods (CLIENT-SIDE httpOnly cookies)

  async storeTokens(accessToken: string, refreshToken: string, provider: AuthProviderName): Promise<void> {
    // Store tokens in httpOnly cookies on CLIENT-SIDE for security
    // These cookies will be sent automatically with every API request

    await this.delay(50);

    // Set httpOnly cookies (requires document.cookie for non-httpOnly or server-side for httpOnly)
    // For development, use localStorage as fallback
    if (import.meta.env.MODE === 'development') {
      log.warn('Using localStorage in development - use httpOnly cookies in production!');
      localStorage.setItem('auth_access_token', accessToken);
      localStorage.setItem('auth_refresh_token', refreshToken);
      localStorage.setItem('auth_provider', provider);
    } else {
      // Production: Set httpOnly cookies
      this.setHttpOnlyCookie('auth_access_token', accessToken, 24 * 60 * 60); // 24 hours
      this.setHttpOnlyCookie('auth_refresh_token', refreshToken, 7 * 24 * 60 * 60); // 7 days
      this.setHttpOnlyCookie('auth_provider', provider, 7 * 24 * 60 * 60); // 7 days
    }

  }

  async getStoredTokens(): Promise<{ accessToken: string | null; refreshToken: string | null; provider: AuthProviderName | null }> {
    await this.delay(50);

    if (import.meta.env.MODE === 'development') {
      // Development: Read from localStorage
      const accessToken = localStorage.getItem('auth_access_token');
      const refreshToken = localStorage.getItem('auth_refresh_token');
      const provider = localStorage.getItem('auth_provider') as AuthProviderName;
      return { accessToken, refreshToken, provider };
    }

    // Production: Read from httpOnly cookies (requires server-side endpoint)
    // For now, fallback to regular cookies
    const accessToken = this.getCookie('auth_access_token');
    const refreshToken = this.getCookie('auth_refresh_token');
    const provider = this.getCookie('auth_provider') as AuthProviderName;
    return { accessToken, refreshToken, provider };
  }

  async clearStoredTokens(): Promise<void> {
    await this.delay(50);

    if (import.meta.env.MODE === 'development') {
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_provider');
    } else {
      // Clear cookies
      this.deleteCookie('auth_access_token');
      this.deleteCookie('auth_refresh_token');
      this.deleteCookie('auth_provider');
    }

  }

  // Cookie utility methods
  private setHttpOnlyCookie(name: string, value: string, maxAge: number): void {
    // For httpOnly cookies, we'd need a server endpoint
    // For now, use regular secure cookies
    const secure = window.location.protocol === 'https:';
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Strict${secure ? '; Secure' : ''}`;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
