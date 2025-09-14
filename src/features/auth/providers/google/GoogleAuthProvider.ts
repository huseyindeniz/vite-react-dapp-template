import log from 'loglevel';

import { AuthProvider, AuthProviderCredentials } from '../types/AuthProvider';

import { GoogleOAuth2CodeResponse, GoogleOAuth2Error } from './types';
import { getGoogleClientId, getGoogleScope } from './utils/env';

export class GoogleAuthProvider implements AuthProvider {
  name = 'google' as const;
  label = 'Google';
  icon = 'https://developers.google.com/identity/images/g-logo.png';
  color = '#4285f4';

  private isInitialized = false;

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

      if (window.google?.accounts?.id) {
        this.isInitialized = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google?.accounts?.id) {
          this.isInitialized = true;
          resolve();
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

  async login(): Promise<AuthProviderCredentials> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      throw new Error('Google Client ID is not configured');
    }

    return new Promise((resolve, reject) => {
      // Initialize Google OAuth2 code flow
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2 not available'));
        return;
      }

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: getGoogleScope(),
        ux_mode: 'popup',
        callback: (response: GoogleOAuth2CodeResponse) => {
          // Note: In a real app, you'd exchange the code for tokens on your backend
          // For now, we'll use the ID token approach instead
          resolve({
            token: response.code,
            email: '', // Would be populated from backend token exchange
            name: '',
            picture: '',
            sub: '',
          });
        },
        error_callback: (error: GoogleOAuth2Error) => {
          reject(
            new Error(`Google auth failed: ${error.type || 'unknown error'}`)
          );
        },
      });

      // Request authorization code
      client.requestCode();
    });
  }

  async logout(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      log.debug('Google logout warning:', error);
    }
  }

  isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      this.isInitialized &&
      !!window.google?.accounts?.id
    );
  }
}
