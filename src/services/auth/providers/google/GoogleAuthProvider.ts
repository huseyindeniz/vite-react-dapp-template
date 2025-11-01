import log from 'loglevel';

import {
  OAuthProviderCredentials,
  IOAuthProvider,
} from '@/features/oauth/types/IOAuthProvider';

// Types not needed for redirect mode - removed unused imports
import {
  getGoogleClientId,
  getGoogleRedirectUri,
  getGoogleScope,
} from './utils/env';

export class GoogleAuthProvider implements IOAuthProvider {
  name = 'google' as const;
  label = 'Google';
  icon = 'https://developers.google.com/identity/images/g-logo.png';
  color = '#4285f4';

  private isInitialized = false;
  private loginWindow: Window | null = null;
  private loginResolve: ((value: OAuthProviderCredentials) => void) | null =
    null;
  private loginReject: ((reason?: Error) => void) | null = null;
  private loginTimeout: NodeJS.Timeout | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;

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
        // Initialize the OAuth2 code client once
        this.initializeCodeClient();
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
          // Initialize the OAuth2 code client once
          this.initializeCodeClient();
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

  private initializeCodeClient(): void {
    const clientId = getGoogleClientId();
    if (!clientId) {
      log.error('Google Client ID is not configured');
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      log.error('Google OAuth2 not available');
    }

    // Don't initialize OAuth2 client for redirect mode - we'll redirect directly
  }

  login(): Promise<OAuthProviderCredentials> {
    log.debug('GoogleAuthProvider login called');
    if (!this.isInitialized) {
      throw new Error('Google Auth provider not ready');
    }

    return new Promise((resolve, reject) => {
      this.loginResolve = resolve;
      this.loginReject = reject;

      try {
        const clientId = getGoogleClientId();
        const scope = getGoogleScope();
        const redirectUri = getGoogleRedirectUri();
        const state = this.generateState();
        log.debug('redirectUri:', redirectUri);

        // Construct Google OAuth URL for hybrid flow to get both code and id_token
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
          response_type: 'code id_token',
          access_type: 'offline',
          prompt: 'consent',
          nonce: this.generateNonce(), // Required for id_token
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        // Setup message listener for popup communication
        this.setupMessageListener();

        // Open popup window
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        this.loginWindow = window.open(
          authUrl,
          'Google Login',
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );

        if (!this.loginWindow) {
          this.cleanup();
          reject(
            new Error(
              'Failed to open Google login window. Please check your popup blocker.'
            )
          );
          return;
        }

        // Set a timeout for the login process (5 minutes)
        this.loginTimeout = setTimeout(
          () => {
            if (this.loginReject) {
              this.cleanup();
              reject(new Error('Login timeout - no response received'));
            }
          },
          5 * 60 * 1000
        );
      } catch (error) {
        this.cleanup();
        reject(error);
      }
    });
  }

  private setupMessageListener(): void {
    // Remove any existing listener
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }

    this.messageListener = (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) {
        log.debug('Ignoring message from unexpected origin:', event.origin);
        return;
      }

      // Handle Google OAuth callback message
      if (event.data?.type === 'google-oauth-callback') {
        log.debug('Received Google OAuth callback:', event.data);

        const { code, idToken, error } = event.data;

        // Note: State validation removed since backend handles session via httpOnly cookies

        if (error) {
          this.handleError(new Error(`Google OAuth error: ${error}`));
          return;
        }

        if (code) {
          try {
            let userInfo = null;

            // If ID token is available, decode it for immediate user info
            if (idToken) {
              userInfo = this.decodeIdToken(idToken);
              log.debug('Using ID token for immediate user info:', userInfo);
            }

            if (this.loginResolve) {
              this.loginResolve({
                token: code, // Always pass the authorization code to backend
                email: userInfo?.email || '',
                name: userInfo?.name || '',
                given_name: userInfo?.given_name || '',
                picture: userInfo?.picture || '',
                sub: userInfo?.sub || '',
              });
              this.cleanup();
            }
          } catch (error) {
            this.handleError(new Error(`Failed to process OAuth response: ${error}`));
          }
        } else {
          this.handleError(new Error('No authorization code received from Google OAuth'));
        }
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  private handleError(error: Error): void {
    log.error('Google OAuth error:', error);
    // Don't try to close the window - it causes COOP errors
    // The window will be cleaned up when the user closes it
    if (this.loginReject) {
      this.loginReject(error);
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.loginResolve = null;
    this.loginReject = null;
    this.loginWindow = null;

    if (this.loginTimeout) {
      clearTimeout(this.loginTimeout);
      this.loginTimeout = null;
    }

    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
      this.messageListener = null;
    }
  }

  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  private generateNonce(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  private decodeIdToken(idToken: string): {
    email?: string;
    name?: string;
    given_name?: string;
    picture?: string;
    sub?: string;
    [key: string]: unknown;
  } {
    try {
      // JWT has 3 parts separated by dots: header.payload.signature
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid ID token format');
      }

      // Decode the payload (base64url encoded)
      const payload = parts[1];
      // Add padding if needed for base64 decoding
      const paddedPayload =
        payload + '='.repeat((4 - (payload.length % 4)) % 4);

      // Convert base64url to base64 and decode properly with UTF-8 support
      const base64 = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
      const binaryString = atob(base64);
      const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
      const decodedPayload = new TextDecoder().decode(bytes);

      return JSON.parse(decodedPayload);
    } catch (error) {
      log.error('Failed to decode ID token:', error);
      throw new Error('Failed to decode user information from ID token');
    }
  }

  async logout(): Promise<void> {
    log.debug('GoogleAuthProvider logout called');
    if (!this.isInitialized) {
      log.debug('Google Auth provider not initialized, nothing to do');
      return;
    }

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      log.debug('Google logout warning:', error);
    }

    // Clean up all OAuth2 state and DOM bindings
    this.cleanupOAuthBindings();
  }

  private cleanupOAuthBindings(): void {
    log.debug('Cleaning up Google OAuth2 bindings');

    // No session storage to clear - backend handles sessions

    // Clean up popup-related state
    this.cleanup();

    log.debug('Google OAuth2 state reset complete');
  }

  isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      this.isInitialized &&
      !!window.google?.accounts?.id
    );
  }
}
