import log from 'loglevel';

import {
  AuthProviderCredentials,
  IAuthProvider,
} from '@/features/auth/types/IAuthProvider';

// Types not needed for redirect mode - removed unused imports
import {
  getGoogleClientId,
  getGoogleRedirectUri,
  getGoogleScope,
} from './utils/env';

export class GoogleAuthProvider implements IAuthProvider {
  name = 'google' as const;
  label = 'Google';
  icon = 'https://developers.google.com/identity/images/g-logo.png';
  color = '#4285f4';

  private isInitialized = false;
  private loginWindow: Window | null = null;
  private loginResolve: ((value: AuthProviderCredentials) => void) | null =
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

  login(): Promise<AuthProviderCredentials> {
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
        // Store state for validation
        sessionStorage.setItem('google_oauth_state', state);

        // Construct Google OAuth URL
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
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
        this.loginTimeout = setTimeout(() => {
          if (this.loginReject) {
            this.cleanup();
            reject(new Error('Login timeout - no response received'));
          }
        }, 5 * 60 * 1000);
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

        const { code, state, error } = event.data;

        // Validate state
        const storedState = sessionStorage.getItem('google_oauth_state');
        if (state !== storedState) {
          this.handleError(
            new Error('Invalid OAuth state. Possible CSRF attack.')
          );
          return;
        }

        // Clear stored state
        sessionStorage.removeItem('google_oauth_state');

        if (error) {
          this.handleError(new Error(`Google OAuth error: ${error}`));
          return;
        }

        if (code) {
          // Don't try to close the popup - let the callback page handle it
          // The callback page will close itself after posting the message

          // Resolve with the authorization code
          if (this.loginResolve) {
            this.loginResolve({
              token: code, // This is the authorization code
              email: '', // Will be populated by backend token exchange
              name: '',
              picture: '',
              sub: '',
            });
            this.cleanup();
          }
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

    // Clear sessionStorage auth state
    sessionStorage.removeItem('google_oauth_state');

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
