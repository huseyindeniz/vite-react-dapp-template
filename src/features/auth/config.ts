import { GoogleAuthProvider } from './providers/google/GoogleAuthProvider';
import { AuthProvider, AuthProviderName } from './providers/types/AuthProvider';

// Supported auth providers
export const SUPPORTED_AUTH_PROVIDERS: AuthProvider[] = [
  new GoogleAuthProvider(),
  // Add more providers here:
  // new AppleAuthProvider(),
  // new GitHubAuthProvider(),
];

// Helper function to get provider by name
export const getAuthProviderByName = (name: AuthProviderName): AuthProvider => {
  const provider = SUPPORTED_AUTH_PROVIDERS.find(p => p.name === name);
  if (!provider) {
    throw new Error(`Auth provider ${name} not found`);
  }
  return provider;
};

// Default provider (optional)
export const DEFAULT_AUTH_PROVIDER: AuthProviderName = 'google';