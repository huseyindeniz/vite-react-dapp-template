import log from 'loglevel';

import { ISessionApi } from '@/domain/features/oauth/models/session/interfaces/ISessionApi';
import { OAuthTokenExchangeRequest } from '@/domain/features/oauth/models/session/types/OAuthTokenExchangeRequest';
import { OAuthUser } from '@/domain/features/oauth/models/session/types/OAuthUser';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * OAuth API service - shows required backend endpoints
 * Currently returns mock data for development
 */
export class OAuthApi implements ISessionApi {
  private static instance: OAuthApi;
  private readonly baseDelay = 500; // Simulate network delay

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): OAuthApi {
    if (!OAuthApi.instance) {
      OAuthApi.instance = new OAuthApi();
    }
    return OAuthApi.instance;
  }

  private delay(ms: number = this.baseDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async exchangeToken(request: OAuthTokenExchangeRequest): Promise<{
    user: OAuthUser;
  }> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/token/exchange
    // Body: { provider: string, token: string, tokenType: string, email?: string, name?: string, given_name?: string, picture?: string, sub?: string }
    // Response: { accessToken: string, refreshToken: string, expiresAt: number, user: OAuthUser }
    //
    // OAuth2 Flow Handling (All providers now use authorization_code):
    // - For all providers (Google, GitHub, LinkedIn, Apple):
    //   1. Validate the authorization code with provider + client_secret
    //   2. Exchange code for access_token from provider
    //   3. Use access_token to fetch complete user info from provider API
    //   4. Return validated user info and set httpOnly cookies for session
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

    log.debug('OAuthApi.exchangeToken called with:', request);

    if (!request.token) {
      throw new Error('Invalid token');
    }

    // Simulate random failures for testing
    if (Math.random() < 0.05) {
      throw new Error('Token exchange failed');
    }

    // Handle different providers - simulate backend fetching real user info
    let email = request.email;
    let name = request.name;
    let picture = request.picture;
    let sub = request.sub;

    if (request.provider === 'google') {
      // For Google, frontend already provided user info from ID token (immediate feedback)
      // Backend validates the authorization code and can enhance user info if needed
      log.debug(
        'Using Google user info from ID token (already validated by frontend)'
      );

      // In real implementation, backend would still validate the code for security
      if (!email || !name) {
        throw new Error('Google user info should be provided from ID token');
      }
    } else if (request.provider === 'github') {
      // For GitHub, we simulate backend fetching user info with the authorization code
      // Frontend provided placeholder data, now backend fetches real data
      // In real implementation, backend would:
      // 1. Exchange authorization code for access token
      // 2. Use access token to fetch user info from GitHub API

      // Simulate real GitHub user info (override placeholder data)
      email = 'john.doe@github.example.com';
      name = 'John Doe';
      picture = 'https://avatars.githubusercontent.com/u/123456?v=4';
      sub = 'github_123456789';

      log.debug('Mock GitHub user info fetched from API:', {
        email,
        name,
        picture,
        sub,
      });
    } else {
      // For future providers (LinkedIn, Apple, etc.)
      throw new Error(
        `Provider ${request.provider} not yet implemented in mock`
      );
    }

    // Generate a proper user ID from the provider's sub (subject identifier)
    const userId =
      sub ||
      `${request.provider}_${btoa(email)
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 8)}`;

    const user: OAuthUser = {
      id: userId,
      email,
      name,
      given_name: request.given_name, // GitHub doesn't provide given_name
      avatarUrl: picture,
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
