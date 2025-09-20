// Provider metadata for UI components
export interface AuthProviderMetadata {
  name: string;
  label: string;
  icon?: string;
  color?: string;
}

// Supported providers metadata (configuration only)
export const SUPPORTED_AUTH_PROVIDERS = [
  {
    name: 'google',
    label: 'Google',
    icon: 'https://developers.google.com/identity/images/g-logo.png',
    color: '#4285f4',
  },
  // Add more provider metadata here:
  // { name: 'linkedin', label: 'LinkedIn', ... },
  // { name: 'apple', label: 'Apple', ... },
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