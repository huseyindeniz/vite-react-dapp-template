// Provider metadata for UI components
export interface OAuthProviderMetadata {
  name: string;
  label: string;
  icon?: string;
  color?: string;
  tokenType: 'authorization_code' | 'access_token';
}

// Supported providers metadata (configuration only)
export const SUPPORTED_OAUTH_PROVIDERS = [
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
export const SUPPORTED_PROVIDER_NAMES = SUPPORTED_OAUTH_PROVIDERS.map(p => p.name);

// Import the derived type for helper functions
import type { OAuthProviderName } from './models/provider/types/OAuthProviderName';

// Helper function to get provider metadata by name
export const getOAuthProviderByName = (name: OAuthProviderName): OAuthProviderMetadata => {
  const provider = SUPPORTED_OAUTH_PROVIDERS.find(p => p.name === name);
  if (!provider) {
    throw new Error(`OAuth provider ${name} not found`);
  }
  return provider;
};

// Default provider (optional) - uses first provider from config
export const DEFAULT_OAUTH_PROVIDER = SUPPORTED_OAUTH_PROVIDERS[0].name;