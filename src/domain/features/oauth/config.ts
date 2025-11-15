// Provider metadata for UI components
export interface OAuthProviderMetadata {
  name: string;
  label: string;
  icon?: string;
  color?: string;
  tokenType: 'authorization_code' | 'access_token';
}

import { SUPPORTED_OAUTH_PROVIDERS } from '@/config/domain/oauth/config';

// Import the derived type for helper functions
import { OAuthProviderName } from './models/provider/types/OAuthProviderName';

// Helper function to get provider metadata by name
export const getOAuthProviderByName = (
  name: OAuthProviderName
): OAuthProviderMetadata => {
  const provider = SUPPORTED_OAUTH_PROVIDERS.find(p => p.name === name);
  if (!provider) {
    throw new Error(`OAuth provider ${name} not found`);
  }
  return provider;
};
