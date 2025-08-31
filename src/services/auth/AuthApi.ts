import { 
  IAuthApi, 
  AuthTokenExchangeRequest, 
  AuthSession, 
  AuthTokenRefreshRequest, 
  AuthUser 
} from './interfaces/IAuthApi';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Auth API service - shows required backend endpoints
 * Currently returns mock data for development
 */
export class AuthApi implements IAuthApi {
  private readonly baseDelay = 500; // Simulate network delay

  private delay(ms: number = this.baseDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateMockToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateMockUser(provider: string, email: string, _token: string): AuthUser {
    const name = email.split('@')[0].replace(/[._]/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
    
    const userId = `${provider}_${btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;
    
    const avatarUrls = {
      google: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285f4&color=fff`,
      apple: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff`,
      github: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`
    };

    return {
      id: userId,
      email,
      name,
      avatarUrl: avatarUrls[provider as keyof typeof avatarUrls],
      provider
    };
  }

  async exchangeToken(request: AuthTokenExchangeRequest): Promise<AuthSession> {
    // BACKEND ENDPOINT NEEDED: POST /api/auth/token/exchange
    // Body: { provider: string, token: string, email?: string }
    // Response: { accessToken: string, refreshToken: string, expiresAt: number, user: AuthUser }
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
        google: 'user@gmail.com',
        apple: 'user@icloud.com',
        github: 'user@users.noreply.github.com'
      };
      email = mockEmails[request.provider] || 'user@example.com';
    }

    const user = this.generateMockUser(request.provider, email, request.token);
    const accessToken = this.generateMockToken(64);
    const refreshToken = this.generateMockToken(48);
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user
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
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    const user: AuthUser = {
      id: 'mock_user_123',
      email: 'user@example.com',
      name: 'Mock User',
      avatarUrl: 'https://ui-avatars.com/api/?name=Mock+User&background=4285f4&color=fff',
      provider: 'google'
    };

    return {
      accessToken,
      refreshToken,
      expiresAt,
      user
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

    // eslint-disable-next-line no-console
    console.log(`Mock logout successful for token: ${accessToken.slice(0, 8)}...`);
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

    return {
      id: 'mock_user_123',
      email: 'user@example.com',
      name: 'Mock User',
      avatarUrl: 'https://ui-avatars.com/api/?name=Mock+User&background=4285f4&color=fff',
      provider: 'google'
    };
  }
}