import log from 'loglevel';

import { AuthSession } from '@/features/auth/models/types/AuthSession';
import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
import { AuthTokenRefreshRequest } from '@/features/auth/models/types/AuthTokenRefreshRequest';
import { AuthUser } from '@/features/auth/models/types/AuthUser';

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

  private generateMockUser(
    provider: string,
    email: string,
    _token: string
  ): AuthUser {
    const name = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());

    const userId = `${provider}_${btoa(email)
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)}`;

    const avatarUrls = {
      google: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285f4&color=fff`,
      apple: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff`,
      github: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`,
    };

    const user = {
      id: userId,
      email,
      name,
      avatarUrl: avatarUrls[provider as keyof typeof avatarUrls],
      provider,
    };
    return user;
  }

  async exchangeToken(request: AuthTokenExchangeRequest): Promise<AuthSession> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/token/exchange
    // Body: { provider: string, token: string, tokenType: string, email?: string }
    // Response: { accessToken: string, refreshToken: string, expiresAt: number, user: AuthUser }
    //
    // OAuth2 Flow Handling:
    // - If tokenType === 'authorization_code' (Google):
    //   1. Use token (authorization code) + client_secret to get access_token from provider
    //   2. Use access_token to fetch user info from provider API
    // - If tokenType === 'access_token' (other providers):
    //   1. Use token directly to fetch user info from provider API
    /*
    const response = await fetch(`http://localhost:3001/api/auth/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        provider: request.provider,
        token: request.token,
        tokenType: request.tokenType,
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

    log.debug('AuthApi.exchangeToken called with:', request);

    if (!request.token) {
      throw new Error('Invalid token');
    }

    // Simulate random failures for testing
    if (Math.random() < 0.05) {
      throw new Error('Token exchange failed');
    }

    let email = request.email;
    if (!email) {
      const mockEmails = {
        google: 'yourname@gmail.com',
        apple: 'user@icloud.com',
        github: 'user@users.noreply.github.com',
      };
      email = mockEmails[request.provider] || 'user@example.com';
    }

    const user = this.generateMockUser(request.provider, email, request.token);
    const accessToken = this.generateMockToken(64);
    const refreshToken = this.generateMockToken(48);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

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

    // Generate consistent user data (in production, this would come from the stored session)
    const user = this.generateMockUser(
      'google',
      'user@gmail.com',
      request.refreshToken
    );

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

  async validateSession(accessToken: string): Promise<AuthUser> {
    // BACKEND ENDPOINT NEEDED: GET /api/auth/me
    // Headers: { Authorization: 'Bearer ${accessToken}' }
    // Response: { id: string, email: string, name: string, avatarUrl?: string, provider: string }
    /*
    const response = await fetch(`http://localhost:3001/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Session validation failed');
    }

    return await response.json();
    */

    // MOCK IMPLEMENTATION (remove when backend is ready)
    await this.delay(300);

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    // Simulate session validation failure
    if (Math.random() < 0.05) {
      throw new Error('Session expired');
    }

    return this.generateMockUser('google', 'user@gmail.com', accessToken);
  }
}
