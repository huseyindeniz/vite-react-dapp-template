import { OAuthProviderMetadata } from '@/domain/features/oauth/config';

// Supported providers metadata (configuration only)
export const SUPPORTED_OAUTH_PROVIDERS: OAuthProviderMetadata[] = [
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
];
