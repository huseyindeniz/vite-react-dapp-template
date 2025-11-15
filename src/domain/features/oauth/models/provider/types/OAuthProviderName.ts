import { SUPPORTED_OAUTH_PROVIDERS } from '@/config/domain/oauth/config';

// Automatically derive provider names from config - no more hardcoding!
export type OAuthProviderName =
  (typeof SUPPORTED_OAUTH_PROVIDERS)[number]['name'];
