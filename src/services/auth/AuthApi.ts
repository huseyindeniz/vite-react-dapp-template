import log from 'loglevel';

import { AuthTokenExchangeRequest } from '@/features/auth/models/types/AuthTokenExchangeRequest';
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



  async exchangeToken(request: AuthTokenExchangeRequest): Promise<{
    user: AuthUser;
  }> {
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

    // Use REAL user info from the ID token that was already decoded on client side
    if (!request.email || !request.name) {
      throw new Error('User info (email and name) are required from ID token');
    }

    // Generate a proper user ID from the provider's sub (subject identifier)
    const userId = request.sub || `${request.provider}_${btoa(request.email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;

    const user: AuthUser = {
      id: userId,
      email: request.email,
      name: request.name,
      given_name: request.given_name,
      avatarUrl: request.picture,
      provider: request.provider,
    };

    // Backend will set httpOnly cookies for access and refresh tokens
    return {
      user,
    };
  }

  async logout(): Promise<void> {
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

    log.debug('Mock logout successful - httpOnly cookies cleared by backend');
  }

}
