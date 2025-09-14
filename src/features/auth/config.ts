import { AuthProviderName } from './types/IAuthProvider';

// Provider metadata for UI components
export interface AuthProviderMetadata {
  name: AuthProviderName;
  label: string;
  icon?: string;
  color?: string;
}

// Supported providers metadata (configuration only)
export const SUPPORTED_AUTH_PROVIDERS: AuthProviderMetadata[] = [
  {
    name: 'google',
    label: 'Google',
    icon: 'https://developers.google.com/identity/images/g-logo.png',
    color: '#4285f4',
  },
  {
    name: 'github',
    label: 'GitHub',
    icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    color: '#24292e',
  },
  // Add more provider metadata here:
  // { name: 'apple', label: 'Apple', ... },
];

// Supported provider names (configuration only)
export const SUPPORTED_PROVIDER_NAMES: AuthProviderName[] = SUPPORTED_AUTH_PROVIDERS.map(p => p.name);

// Helper function to get provider metadata by name
export const getAuthProviderByName = (name: AuthProviderName): AuthProviderMetadata => {
  const provider = SUPPORTED_AUTH_PROVIDERS.find(p => p.name === name);
  if (!provider) {
    throw new Error(`Auth provider ${name} not found`);
  }
  return provider;
};

// Default provider (optional)
export const DEFAULT_AUTH_PROVIDER: AuthProviderName = 'google';