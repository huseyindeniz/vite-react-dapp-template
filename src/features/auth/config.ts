// Provider metadata for UI components
export interface AuthProviderMetadata {
  name: string;
  label: string;
  icon?: string;
  color?: string;
  tokenType: 'authorization_code' | 'access_token';
}

// Supported providers metadata (configuration only)
export const SUPPORTED_AUTH_PROVIDERS = [
  {
    name: 'google',
    label: 'Google',
    icon: 'https://developers.google.com/identity/images/g-logo.png',
    color: '#4285f4',
    tokenType: 'authorization_code',
  },
  {
    name: 'github',
    label: 'GitHub',
    icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    color: '#24292e',
    tokenType: 'authorization_code',
  },
  // Add more provider metadata here:
  // { name: 'apple', label: 'Apple', tokenType: 'access_token', ... },
] as const;

// Supported provider names (configuration only) - automatically derived from providers
export const SUPPORTED_PROVIDER_NAMES = SUPPORTED_AUTH_PROVIDERS.map(p => p.name);

// Import the derived type for helper functions
import type { AuthProviderName } from './types/IAuthProvider';

// Helper function to get provider metadata by name
export const getAuthProviderByName = (name: AuthProviderName): AuthProviderMetadata => {
  const provider = SUPPORTED_AUTH_PROVIDERS.find(p => p.name === name);
  if (!provider) {
    throw new Error(`Auth provider ${name} not found`);
  }
  return provider;
};

// Default provider (optional) - uses first provider from config
export const DEFAULT_AUTH_PROVIDER = SUPPORTED_AUTH_PROVIDERS[0].name;