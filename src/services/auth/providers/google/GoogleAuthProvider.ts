import log from 'loglevel';

import {
  AuthProviderCredentials,
  IAuthProvider,
} from '@/features/auth/types/IAuthProvider';

import { getGoogleClientId, getGoogleScope } from './utils/env';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
            error_callback?: (error: {
              message?: string;
              [key: string]: unknown;
            }) => void;
          }) => TokenClient;
          hasGrantedAllScopes: (
            tokenResponse: TokenResponse,
            ...scopes: string[]
          ) => boolean;
          hasGrantedAnyScope: (
            tokenResponse: TokenResponse,
            ...scopes: string[]
          ) => boolean;
          revoke: (token: string, callback?: () => void) => void;
        };
      };
    };
  }
}

interface TokenResponse {
  access_token: string;
  authuser?: string;
  expires_in: number;
  prompt?: string;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface TokenClient {
  requestAccessToken: (overrideConfig?: {
    prompt?: string;
    hint?: string;
    state?: string;
  }) => void;
}

export class GoogleAuthProvider implements IAuthProvider {
  name = 'google' as const;
  label = 'Google';
  icon = 'https://developers.google.com/identity/images/g-logo.png';
  color = '#4285f4';

  private isInitialized = false;
  private tokenClient: TokenClient | null = null;
  private loginResolve: ((value: AuthProviderCredentials) => void) | null =
    null;
  private loginReject: ((reason?: Error) => void) | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Load Google Identity Services
      if (typeof window === 'undefined') {
        reject(new Error('Google Auth is not available in server environment'));
        return;
      }

      const initializeTokenClient = () => {
        if (!window.google?.accounts?.oauth2) {
          reject(new Error('Google OAuth2 not available'));
          return;
        }

        const clientId = getGoogleClientId();
        const scope = getGoogleScope();

        if (!clientId) {
          reject(new Error('Google Client ID is not configured'));
          return;
        }

        // Initialize the token client
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope,
          callback: (response: TokenResponse) => {
            this.handleTokenResponse(response);
          },
          error_callback: (error: {
            message?: string;
            [key: string]: unknown;
          }) => {
            log.error('Google OAuth error:', error);
            if (this.loginReject) {
              this.loginReject(
                new Error(error?.message || 'Google OAuth error occurred')
              );
              this.cleanup();
            }
          },
        });

        this.isInitialized = true;
        resolve();
      };

      if (window.google?.accounts?.oauth2) {
        initializeTokenClient();
        return;
      }

      // Load the Google Identity Services library
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google?.accounts?.oauth2) {
          initializeTokenClient();
        } else {
          reject(new Error('Failed to load Google Identity Services'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };

      document.head.appendChild(script);
    });
  }

  login(): Promise<AuthProviderCredentials> {
    log.debug('GoogleAuthProvider login called');

    if (!this.isInitialized || !this.tokenClient) {
      throw new Error('Google Auth provider not ready');
    }

    return new Promise((resolve, reject) => {
      this.loginResolve = resolve;
      this.loginReject = reject;

      try {
        // Request access token - this will open the Google consent popup
        if (this.tokenClient) {
          this.tokenClient.requestAccessToken({
            prompt: '', // Let Google decide whether to show consent
          });
        }
      } catch (error) {
        this.cleanup();
        reject(error);
      }
    });
  }

  private async handleTokenResponse(response: TokenResponse): Promise<void> {
    log.debug('Google token response received');

    if (response.error) {
      const errorMessage = response.error_description || response.error;
      log.error('Google OAuth error:', errorMessage);
      if (this.loginReject) {
        this.loginReject(new Error(errorMessage));
      }
      this.cleanup();
      return;
    }

    if (!response.access_token) {
      log.error('No access token in response');
      if (this.loginReject) {
        this.loginReject(new Error('No access token received from Google'));
      }
      this.cleanup();
      return;
    }

    // Get user info using the access token
    try {
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();

      log.debug('Google userInfo:', userInfo);

      // Return access token with decoded user info
      if (this.loginResolve) {
        this.loginResolve({
          token: response.access_token,
          email: userInfo.email || '',
          name: userInfo.name || '',
          given_name: userInfo.given_name || '',
          picture: userInfo.picture || '',
          sub: userInfo.sub || '',
        });
      }
    } catch (error) {
      log.error('Failed to get user info:', error);
      if (this.loginReject) {
        this.loginReject(
          error instanceof Error
            ? error
            : new Error('Failed to get user info from Google')
        );
      }
    } finally {
      this.cleanup();
    }
  }

  private cleanup(): void {
    this.loginResolve = null;
    this.loginReject = null;
  }

  async logout(): Promise<void> {
    log.debug('GoogleAuthProvider logout called');

    if (!this.isInitialized) {
      log.debug('Google Auth provider not initialized, nothing to do');
      return;
    }

    // Google OAuth2 token client doesn't require explicit cleanup
    // Tokens are managed by the backend
    this.cleanup();
  }

  isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      this.isInitialized &&
      !!this.tokenClient &&
      !!window.google?.accounts?.oauth2
    );
  }
}
