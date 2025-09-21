import log from 'loglevel';

import { AuthProviderCredentials, IAuthProvider } from '@/features/auth/types/IAuthProvider';

import { getGitHubClientId, getGitHubRedirectUri, getGitHubScope } from './utils/env';

export class GitHubAuthProvider implements IAuthProvider {
  name = 'github' as const;
  label = 'GitHub';
  icon = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  color = '#24292e';

  private isInitialized = false;
  private loginWindow: Window | null = null;
  private loginResolve: ((value: AuthProviderCredentials) => void) | null = null;
  private loginReject: ((reason?: Error) => void) | null = null;
  private loginTimeout: NodeJS.Timeout | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  async initialize(): Promise<void> {
    log.debug('Initializing GitHubAuthProvider');
    if (this.isInitialized) {
      log.debug('GitHubAuthProvider already initialized');
      return;
    }

    // Validate configuration
    try {
      getGitHubClientId();
      this.isInitialized = true;
      log.debug('GitHubAuthProvider initialized successfully');
    } catch (error) {
      log.error('Failed to initialize GitHubAuthProvider:', error);
      throw error;
    }
  }

  login(): Promise<AuthProviderCredentials> {
    log.debug('GitHubAuthProvider login called');
    if (!this.isInitialized) {
      throw new Error('GitHub Auth provider not ready');
    }

    return new Promise((resolve, reject) => {
      this.loginResolve = resolve;
      this.loginReject = reject;

      try {
        const clientId = getGitHubClientId();
        const redirectUri = getGitHubRedirectUri();
        const scope = getGitHubScope();
        const state = this.generateState();

        // Store state for validation
        sessionStorage.setItem('github_oauth_state', state);

        // Construct GitHub OAuth URL
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
          response_type: 'code',
        });

        const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

        // Setup message listener for popup communication
        this.setupMessageListener();

        // Open popup window
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        this.loginWindow = window.open(
          authUrl,
          'GitHub Login',
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );

        if (!this.loginWindow) {
          this.cleanup();
          reject(new Error('Failed to open GitHub login window. Please check your popup blocker.'));
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
      const expectedOrigin = new URL(getGitHubRedirectUri()).origin;
      if (event.origin !== expectedOrigin && event.origin !== window.location.origin) {
        log.debug('Ignoring message from unexpected origin:', event.origin);
        return;
      }

      // Handle GitHub OAuth callback message
      if (event.data?.type === 'github-oauth-callback') {
        log.debug('Received GitHub OAuth callback:', event.data);

        const { code, state, error } = event.data;

        // Validate state
        const storedState = sessionStorage.getItem('github_oauth_state');
        if (state !== storedState) {
          this.handleError(new Error('Invalid OAuth state. Possible CSRF attack.'));
          return;
        }

        // Clear stored state
        sessionStorage.removeItem('github_oauth_state');

        if (error) {
          this.handleError(new Error(`GitHub OAuth error: ${error}`));
          return;
        }

        if (code) {
          // Don't try to close the popup - let the callback page handle it
          // The callback page will close itself after posting the message

          // Resolve with the authorization code and placeholder user data
          // Backend will exchange code for access token and fetch real user info
          if (this.loginResolve) {
            this.loginResolve({
              token: code, // This is the authorization code
              email: 'github.user@placeholder.com', // Placeholder until backend responds
              name: 'GitHub User', // Placeholder until backend responds
              given_name: '', // GitHub doesn't provide given_name
              picture: 'https://github.com/identicons/placeholder.png', // Placeholder avatar
              sub: 'github_placeholder', // Placeholder until backend responds
            });
            this.cleanup();
          }
        }
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  private handleError(error: Error): void {
    log.error('GitHub OAuth error:', error);
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
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async logout(): Promise<void> {
    // GitHub doesn't provide a client-side logout mechanism
    // The actual logout is handled by clearing the session on our backend
    log.debug('GitHub logout called');
    this.cleanup();
  }

  isAvailable(): boolean {
    try {
      return (
        typeof window !== 'undefined' &&
        this.isInitialized &&
        !!getGitHubClientId()
      );
    } catch {
      // GitHub client ID not configured
      return false;
    }
  }
}